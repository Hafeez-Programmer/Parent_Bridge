enum AttendanceStatus { present, absent, late, leave }

class ParentProfile {
  const ParentProfile({
    required this.id,
    required this.fullName,
    required this.email,
    required this.role,
    required this.isActive,
  });

  final String id;
  final String fullName;
  final String email;
  final String role;
  final bool isActive;

  String get initial => fullName.isNotEmpty ? fullName[0].toUpperCase() : 'P';
}

class AttendanceDayRecord {
  const AttendanceDayRecord({
    required this.dateLabel,
    required this.status,
    this.tabular = false,
  });

  final String dateLabel;
  final AttendanceStatus status;
  final bool tabular;
}

class SubjectScore {
  const SubjectScore({
    required this.subject,
    required this.shortName,
    required this.obtained,
    required this.total,
  });

  final String subject;
  final String shortName;
  final int obtained;
  final int total;

  double get ratio => total == 0 ? 0 : obtained / total;
}

class ExamResult {
  const ExamResult({
    required this.id,
    required this.term,
    required this.title,
    required this.grade,
    required this.percentage,
    required this.subjects,
  });

  final String id;
  final String term;
  final String title;
  final String grade;
  final double percentage;
  final List<SubjectScore> subjects;

  int get totalObtained => subjects.fold(0, (sum, s) => sum + s.obtained);
  int get totalMax => subjects.fold(0, (sum, s) => sum + s.total);
}

class Announcement {
  const Announcement({
    required this.id,
    required this.title,
    required this.audience,
    required this.timeLabel,
    required this.postedAt,
    required this.postedBy,
    required this.paragraphs,
    this.unread = false,
  });

  final String id;
  final String title;
  final String audience;
  final String timeLabel;
  final String postedAt;
  final String postedBy;
  final List<String> paragraphs;
  final bool unread;

  Announcement copyWith({bool? unread}) => Announcement(
        id: id,
        title: title,
        audience: audience,
        timeLabel: timeLabel,
        postedAt: postedAt,
        postedBy: postedBy,
        paragraphs: paragraphs,
        unread: unread ?? this.unread,
      );
}

class ChildProfile {
  const ChildProfile({
    required this.id,
    required this.name,
    required this.classId,
    required this.className,
    required this.rollNumber,
    required this.attendancePercent,
    required this.lastResultPercent,
    required this.todayStatus,
    required this.presentCount,
    required this.absentCount,
    required this.lateCount,
    required this.recentDays,
    required this.exams,
  });

  final String id;
  final String name;
  final String classId;
  final String className;
  final String rollNumber;
  final int attendancePercent;
  final int lastResultPercent;
  final AttendanceStatus? todayStatus;
  final int presentCount;
  final int absentCount;
  final int lateCount;
  final List<AttendanceDayRecord> recentDays;
  final List<ExamResult> exams;

  String get initial => name.isNotEmpty ? name[0].toUpperCase() : '?';
}
