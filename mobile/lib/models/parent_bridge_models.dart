enum AttendanceStatus { present, absent, late }

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
    required this.term,
    required this.title,
    required this.grade,
    required this.percentage,
    required this.subjects,
  });

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
  final String className;
  final String rollNumber;
  final int attendancePercent;
  final int lastResultPercent;
  final AttendanceStatus todayStatus;
  final int presentCount;
  final int absentCount;
  final int lateCount;
  final List<AttendanceDayRecord> recentDays;
  final List<ExamResult> exams;

  String get initial => name.isNotEmpty ? name[0].toUpperCase() : '?';
}

abstract final class MockParentData {
  static const String parentName = 'Fatima Khan';
  static const String parentEmail = 'fatima.khan@email.com';

  static final List<ChildProfile> initialChildren = [
    ChildProfile(
      id: 'c1',
      name: 'Ali Khan',
      className: 'Class 8-A',
      rollNumber: '12',
      attendancePercent: 92,
      lastResultPercent: 78,
      todayStatus: AttendanceStatus.present,
      presentCount: 21,
      absentCount: 2,
      lateCount: 1,
      recentDays: const [
        AttendanceDayRecord(dateLabel: 'Today', status: AttendanceStatus.present),
        AttendanceDayRecord(dateLabel: 'Yesterday', status: AttendanceStatus.present),
        AttendanceDayRecord(
          dateLabel: 'Mon, 12 Oct',
          status: AttendanceStatus.absent,
          tabular: true,
        ),
        AttendanceDayRecord(
          dateLabel: 'Thu, 8 Oct',
          status: AttendanceStatus.late,
          tabular: true,
        ),
      ],
      exams: const [
        ExamResult(
          term: 'Mid-Term',
          title: 'Mid-Term Result',
          grade: 'B+',
          percentage: 78.6,
          subjects: [
            SubjectScore(subject: 'Mathematics', shortName: 'Math', obtained: 82, total: 100),
            SubjectScore(subject: 'English', shortName: 'Eng', obtained: 74, total: 100),
            SubjectScore(subject: 'Science', shortName: 'Sci', obtained: 79, total: 100),
            SubjectScore(subject: 'Urdu', shortName: 'Urdu', obtained: 70, total: 100),
            SubjectScore(subject: 'Islamiyat', shortName: 'Isl', obtained: 88, total: 100),
          ],
        ),
        ExamResult(
          term: 'First Term',
          title: 'First Term Result',
          grade: 'A',
          percentage: 84.0,
          subjects: [
            SubjectScore(subject: 'Mathematics', shortName: 'Math', obtained: 88, total: 100),
            SubjectScore(subject: 'English', shortName: 'Eng', obtained: 80, total: 100),
            SubjectScore(subject: 'Science', shortName: 'Sci', obtained: 84, total: 100),
            SubjectScore(subject: 'Urdu', shortName: 'Urdu', obtained: 78, total: 100),
            SubjectScore(subject: 'Islamiyat', shortName: 'Isl', obtained: 90, total: 100),
          ],
        ),
      ],
    ),
    ChildProfile(
      id: 'c2',
      name: 'Sara Khan',
      className: 'Class 5-B',
      rollNumber: '07',
      attendancePercent: 96,
      lastResultPercent: 89,
      todayStatus: AttendanceStatus.present,
      presentCount: 23,
      absentCount: 0,
      lateCount: 1,
      recentDays: const [
        AttendanceDayRecord(dateLabel: 'Today', status: AttendanceStatus.present),
        AttendanceDayRecord(dateLabel: 'Yesterday', status: AttendanceStatus.present),
        AttendanceDayRecord(
          dateLabel: 'Mon, 12 Oct',
          status: AttendanceStatus.present,
          tabular: true,
        ),
        AttendanceDayRecord(
          dateLabel: 'Thu, 8 Oct',
          status: AttendanceStatus.late,
          tabular: true,
        ),
      ],
      exams: const [
        ExamResult(
          term: 'Mid-Term',
          title: 'Mid-Term Result',
          grade: 'A',
          percentage: 89.0,
          subjects: [
            SubjectScore(subject: 'Mathematics', shortName: 'Math', obtained: 92, total: 100),
            SubjectScore(subject: 'English', shortName: 'Eng', obtained: 86, total: 100),
            SubjectScore(subject: 'Science', shortName: 'Sci', obtained: 90, total: 100),
            SubjectScore(subject: 'Urdu', shortName: 'Urdu', obtained: 85, total: 100),
            SubjectScore(subject: 'Islamiyat', shortName: 'Isl', obtained: 92, total: 100),
          ],
        ),
      ],
    ),
  ];

  static final List<Announcement> initialAnnouncements = [
    const Announcement(
      id: 'a1',
      title: 'Sports Day - 5 Nov',
      audience: 'All classes',
      timeLabel: '2h ago',
      postedAt: 'Today, 9:15 AM',
      postedBy: 'Admin',
      unread: true,
      paragraphs: [
        'Annual Sports Day will take place on Wednesday, 5 November on the main school grounds from 8:30 AM to 1:30 PM.',
        'Students should arrive in their house sports kit and bring a labeled water bottle. Parents are warmly invited to attend the track finals and prize distribution starting at 11:00 AM.',
      ],
    ),
    const Announcement(
      id: 'a2',
      title: 'Class 8-A: Math quiz',
      audience: 'Class 8-A',
      timeLabel: 'Yesterday',
      postedAt: 'Yesterday, 2:30 PM',
      postedBy: 'Ms. Sara (Teacher)',
      unread: true,
      paragraphs: [
        'Class 8-A will have a short Mathematics quiz on Chapter 4 (Linear Equations) this Friday during the second period.',
        'Please ensure students revise the practice worksheet shared in class.',
      ],
    ),
    const Announcement(
      id: 'a3',
      title: 'Winter break notice',
      audience: 'All classes',
      timeLabel: '3 days ago',
      postedAt: '15 Oct, 10:00 AM',
      postedBy: 'Admin',
      unread: false,
      paragraphs: [
        'The school will observe winter break from 24 December to 4 January. Regular classes will resume on Monday, 5 January.',
      ],
    ),
    const Announcement(
      id: 'a4',
      title: 'Uniform policy update',
      audience: 'All classes',
      timeLabel: '1 week ago',
      postedAt: '10 Oct, 8:45 AM',
      postedBy: 'Admin',
      unread: false,
      paragraphs: [
        'Students are requested to wear the winter navy sweater starting 1 November. House kits remain required on Wednesdays.',
      ],
    ),
  ];
}
