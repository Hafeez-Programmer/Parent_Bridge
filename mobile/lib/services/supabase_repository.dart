import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/parent_bridge_models.dart';

class SupabaseRepository {
  SupabaseRepository({SupabaseClient? client}) : _clientOverride = client;

  final SupabaseClient? _clientOverride;

  SupabaseClient get _client => _clientOverride ?? Supabase.instance.client;

  Session? get currentSession => _client.auth.currentSession;

  Future<ParentProfile> signIn({
    required String email,
    required String password,
  }) async {
    final response = await _client.auth.signInWithPassword(
      email: email.trim(),
      password: password,
    );

    final user = response.user;
    if (user == null) {
      throw const AuthException('Unable to sign in. Please try again.');
    }

    final profile = await fetchParentProfile();
    if (profile.role != 'parent') {
      await _client.auth.signOut();
      throw const AuthException(
        'This app is for parents. Please use the web dashboard for staff accounts.',
      );
    }
    if (!profile.isActive) {
      await _client.auth.signOut();
      throw const AuthException(
        'Your account is inactive. Please contact the school office.',
      );
    }

    return profile;
  }

  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  Future<void> sendPasswordReset(String email) async {
    await _client.auth.resetPasswordForEmail(email.trim());
  }

  Future<void> updatePassword(String newPassword) async {
    await _client.auth.updateUser(UserAttributes(password: newPassword));
  }

  Future<ParentProfile> fetchParentProfile() async {
    final userId = _client.auth.currentUser?.id;
    if (userId == null) {
      throw const AuthException('Not authenticated');
    }

    final row = await _client
        .from('profiles')
        .select('id, full_name, email, role, is_active')
        .eq('id', userId)
        .single();

    return ParentProfile(
      id: row['id'] as String,
      fullName: (row['full_name'] as String?) ?? 'Parent',
      email: (row['email'] as String?) ?? '',
      role: (row['role'] as String?) ?? 'parent',
      isActive: (row['is_active'] as bool?) ?? true,
    );
  }

  Future<List<ChildProfile>> fetchLinkedChildren() async {
    final userId = _client.auth.currentUser?.id;
    if (userId == null) return [];

    final links = await _client
        .from('parent_students')
        .select(
          'student_id, students(id, roll_no, full_name, class_id, classes(id, name, section))',
        )
        .eq('parent_id', userId)
        .order('created_at', ascending: true);

    final children = <ChildProfile>[];
    for (final link in links) {
      final student = link['students'] as Map<String, dynamic>?;
      if (student == null) continue;

      final studentId = student['id'] as String;
      final cls = student['classes'] as Map<String, dynamic>?;
      final classLabel = cls != null ? 'Class ${cls['name']}-${cls['section']}' : 'Class —';
      final classId = (student['class_id'] as String?) ?? '';

      final attendanceRows = await _client
          .from('attendance')
          .select('date, status')
          .eq('student_id', studentId)
          .order('date', ascending: false);

      final resultRows = await _client
          .from('results')
          .select(
            'marks_obtained, total_marks, exams!inner(id, name, term, is_published), subjects(name)',
          )
          .eq('student_id', studentId)
          .eq('exams.is_published', true);

      children.add(
        _buildChildProfile(
          studentId: studentId,
          name: (student['full_name'] as String?) ?? 'Student',
          classId: classId,
          className: classLabel,
          rollNumber: (student['roll_no'] as String?) ?? '',
          attendanceRows: List<Map<String, dynamic>>.from(attendanceRows),
          resultRows: List<Map<String, dynamic>>.from(resultRows),
        ),
      );
    }

    return children;
  }

  Future<List<Announcement>> fetchAnnouncements() async {
    final rows = await _client
        .from('announcements')
        .select(
          'id, title, body, created_at, classes(name, section), profiles!announcements_created_by_fkey(full_name, role)',
        )
        .order('created_at', ascending: false);

    return List<Map<String, dynamic>>.from(rows).map((row) {
      final cls = row['classes'] as Map<String, dynamic>?;
      final author = row['profiles'] as Map<String, dynamic>?;
      final createdAt = DateTime.tryParse((row['created_at'] as String?) ?? '')?.toLocal();

      final audience =
          cls != null ? 'Class ${cls['name']}-${cls['section']}' : 'All classes';
      final authorName = (author?['full_name'] as String?) ?? 'School Office';
      final authorRole = (author?['role'] as String?) ?? '';
      final postedBy = authorRole == 'admin'
          ? 'Admin'
          : authorRole == 'teacher'
              ? '$authorName (Teacher)'
              : authorName;

      final bodyText = (row['body'] as String?)?.trim() ?? '';
      final paragraphs = bodyText.isEmpty
          ? ['No additional details provided.']
          : bodyText
              .split(RegExp(r'\n\s*\n'))
              .map((p) => p.trim())
              .where((p) => p.isNotEmpty)
              .toList();

      return Announcement(
        id: row['id'] as String,
        title: (row['title'] as String?) ?? 'Announcement',
        audience: audience,
        timeLabel: _relativeTime(createdAt),
        postedAt: _formatPostedAt(createdAt),
        postedBy: postedBy,
        paragraphs: paragraphs,
        unread: true,
      );
    }).toList();
  }

  Future<String> linkChild({
    required String linkCode,
    required String rollNumber,
  }) async {
    final studentId = await _client.rpc(
      'link_student',
      params: {
        'p_link_code': linkCode.trim().toUpperCase(),
        'p_roll_no': rollNumber.trim(),
      },
    );
    return studentId as String;
  }

  ChildProfile _buildChildProfile({
    required String studentId,
    required String name,
    required String classId,
    required String className,
    required String rollNumber,
    required List<Map<String, dynamic>> attendanceRows,
    required List<Map<String, dynamic>> resultRows,
  }) {
    var presentCount = 0;
    var absentCount = 0;
    var lateCount = 0;
    AttendanceStatus? todayStatus;
    final todayIso = _isoDate(DateTime.now());
    final recentDays = <AttendanceDayRecord>[];

    for (final row in attendanceRows) {
      final dateStr = (row['date'] as String?) ?? '';
      final status = _parseStatus((row['status'] as String?) ?? 'present');

      if (dateStr == todayIso) {
        todayStatus = status;
      }

      switch (status) {
        case AttendanceStatus.present:
          presentCount++;
        case AttendanceStatus.absent:
          absentCount++;
        case AttendanceStatus.late:
          lateCount++;
        case AttendanceStatus.leave:
          break;
      }

      if (recentDays.length < 10) {
        final formatted = _formatAttendanceDate(dateStr);
        recentDays.add(
          AttendanceDayRecord(
            dateLabel: formatted.label,
            status: status,
            tabular: formatted.tabular,
          ),
        );
      }
    }

    final totalMarked = attendanceRows.length;
    final attendancePercent = totalMarked == 0
        ? 0
        : (((presentCount + lateCount) / totalMarked) * 100).round();

    // Group results by exam
    final examGroups = <String, _ExamAccumulator>{};
    for (final row in resultRows) {
      final exam = row['exams'] as Map<String, dynamic>?;
      final subject = row['subjects'] as Map<String, dynamic>?;
      if (exam == null || subject == null) continue;

      final examId = exam['id'] as String;
      final examName = (exam['name'] as String?) ?? 'Exam';
      final term = (exam['term'] as String?) ?? examName;
      final subjectName = (subject['name'] as String?) ?? 'Subject';
      final obtained = ((row['marks_obtained'] as num?) ?? 0).round();
      final total = ((row['total_marks'] as num?) ?? 100).round();

      examGroups.putIfAbsent(
        examId,
        () => _ExamAccumulator(id: examId, term: term, title: '$examName Result'),
      );
      examGroups[examId]!.subjects.add(
            SubjectScore(
              subject: subjectName,
              shortName: _shortSubject(subjectName),
              obtained: obtained,
              total: total,
            ),
          );
    }

    final exams = examGroups.values.map((acc) {
      final obtained = acc.subjects.fold(0, (s, e) => s + e.obtained);
      final max = acc.subjects.fold(0, (s, e) => s + e.total);
      final pct = max == 0 ? 0.0 : (obtained / max) * 100;
      return ExamResult(
        id: acc.id,
        term: acc.term,
        title: acc.title,
        grade: _computeGrade(pct),
        percentage: pct,
        subjects: acc.subjects,
      );
    }).toList();

    final lastResultPercent = exams.isEmpty ? 0 : exams.first.percentage.round();

    return ChildProfile(
      id: studentId,
      name: name,
      classId: classId,
      className: className,
      rollNumber: rollNumber,
      attendancePercent: attendancePercent,
      lastResultPercent: lastResultPercent,
      todayStatus: todayStatus,
      presentCount: presentCount,
      absentCount: absentCount,
      lateCount: lateCount,
      recentDays: recentDays,
      exams: exams,
    );
  }

  static AttendanceStatus _parseStatus(String raw) {
    switch (raw.toLowerCase()) {
      case 'absent':
        return AttendanceStatus.absent;
      case 'late':
        return AttendanceStatus.late;
      case 'leave':
        return AttendanceStatus.leave;
      default:
        return AttendanceStatus.present;
    }
  }

  static String _shortSubject(String name) {
    const map = {
      'Mathematics': 'Math',
      'English': 'Eng',
      'Science': 'Sci',
      'Urdu': 'Urdu',
      'Islamiyat': 'Isl',
    };
    return map[name] ?? (name.length > 4 ? name.substring(0, 4) : name);
  }

  static String _computeGrade(double pct) {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 75) return 'B+';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  }

  static String _isoDate(DateTime dt) =>
      '${dt.year.toString().padLeft(4, '0')}-${dt.month.toString().padLeft(2, '0')}-${dt.day.toString().padLeft(2, '0')}';

  static ({String label, bool tabular}) _formatAttendanceDate(String iso) {
    final parsed = DateTime.tryParse(iso);
    if (parsed == null) return (label: iso, tabular: false);

    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final target = DateTime(parsed.year, parsed.month, parsed.day);
    final diff = today.difference(target).inDays;

    if (diff == 0) return (label: 'Today', tabular: false);
    if (diff == 1) return (label: 'Yesterday', tabular: false);

    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    final wd = weekdays[parsed.weekday - 1];
    final mo = months[parsed.month - 1];
    return (label: '$wd, ${parsed.day} $mo', tabular: true);
  }

  static String _relativeTime(DateTime? dt) {
    if (dt == null) return 'Recently';
    final diff = DateTime.now().difference(dt);
    if (diff.inMinutes < 60) return '${diff.inMinutes.clamp(1, 59)}m ago';
    if (diff.inHours < 24) return '${diff.inHours}h ago';
    if (diff.inDays == 1) return 'Yesterday';
    if (diff.inDays < 7) return '${diff.inDays} days ago';
    return '${(diff.inDays / 7).floor()}w ago';
  }

  static String _formatPostedAt(DateTime? dt) {
    if (dt == null) return 'Recently';
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    final hour12 = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final amPm = dt.hour >= 12 ? 'PM' : 'AM';
    final min = dt.minute.toString().padLeft(2, '0');
    return '${dt.day} ${months[dt.month - 1]}, $hour12:$min $amPm';
  }
}

class _ExamAccumulator {
  _ExamAccumulator({required this.id, required this.term, required this.title});

  final String id;
  final String term;
  final String title;
  final List<SubjectScore> subjects = [];
}
