import 'package:flutter/foundation.dart';
import '../models/parent_bridge_models.dart';

class AppState extends ChangeNotifier {
  AppState()
      : _children = List.of(MockParentData.initialChildren),
        _announcements = List.of(MockParentData.initialAnnouncements);

  final List<ChildProfile> _children;
  final List<Announcement> _announcements;
  int _selectedChildIndex = 0;

  bool _announcementAlerts = true;
  bool _absenceAlerts = true;
  bool _resultAlerts = true;

  List<ChildProfile> get children => List.unmodifiable(_children);
  int get selectedChildIndex => _selectedChildIndex;
  ChildProfile get activeChild => _children[_selectedChildIndex];
  List<Announcement> get announcements => List.unmodifiable(_announcements);

  bool get announcementAlerts => _announcementAlerts;
  bool get absenceAlerts => _absenceAlerts;
  bool get resultAlerts => _resultAlerts;

  void selectChild(int index) {
    if (index < 0 || index >= _children.length) return;
    _selectedChildIndex = index;
    notifyListeners();
  }

  void markAnnouncementRead(String id) {
    final idx = _announcements.indexWhere((a) => a.id == id);
    if (idx == -1 || !_announcements[idx].unread) return;
    _announcements[idx] = _announcements[idx].copyWith(unread: false);
    notifyListeners();
  }

  void setAnnouncementAlerts(bool value) {
    _announcementAlerts = value;
    notifyListeners();
  }

  void setAbsenceAlerts(bool value) {
    _absenceAlerts = value;
    notifyListeners();
  }

  void setResultAlerts(bool value) {
    _resultAlerts = value;
    notifyListeners();
  }

  void linkChild({required String linkCode, required String rollNumber}) {
    final normalizedRoll = rollNumber.trim().isEmpty ? '15' : rollNumber.trim();
    final newChild = ChildProfile(
      id: 'c${_children.length + 1}',
      name: 'Zainab Khan',
      className: 'Class 6-A',
      rollNumber: normalizedRoll.padLeft(2, '0'),
      attendancePercent: 95,
      lastResultPercent: 86,
      todayStatus: AttendanceStatus.present,
      presentCount: 22,
      absentCount: 1,
      lateCount: 0,
      recentDays: const [
        AttendanceDayRecord(dateLabel: 'Today', status: AttendanceStatus.present),
        AttendanceDayRecord(dateLabel: 'Yesterday', status: AttendanceStatus.present),
      ],
      exams: MockParentData.initialChildren.first.exams,
    );
    _children.add(newChild);
    _selectedChildIndex = _children.length - 1;
    notifyListeners();
  }
}
