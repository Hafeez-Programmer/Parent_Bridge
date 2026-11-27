import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/parent_bridge_models.dart';
import '../services/supabase_repository.dart';

class AppState extends ChangeNotifier {
  AppState({SupabaseRepository? repository})
      : _repo = repository ?? SupabaseRepository();

  final SupabaseRepository _repo;

  ParentProfile? _profile;
  List<ChildProfile> _children = [];
  List<Announcement> _announcements = [];
  final Set<String> _readAnnouncementIds = {};
  int _selectedChildIndex = 0;

  bool _isLoading = false;
  String? _errorMessage;

  bool _announcementAlerts = true;
  bool _absenceAlerts = true;
  bool _resultAlerts = true;

  ParentProfile? get profile => _profile;
  List<ChildProfile> get children => List.unmodifiable(_children);
  int get selectedChildIndex => _selectedChildIndex;
  ChildProfile? get activeChild =>
      _children.isEmpty ? null : _children[_selectedChildIndex.clamp(0, _children.length - 1)];
  List<Announcement> get announcements => List.unmodifiable(_announcements);
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get hasSession => _repo.currentSession != null;

  bool get announcementAlerts => _announcementAlerts;
  bool get absenceAlerts => _absenceAlerts;
  bool get resultAlerts => _resultAlerts;

  Future<void> initialize() async {
    if (_repo.currentSession == null) return;
    await refreshDashboard();
  }

  Future<bool> signIn({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _profile = await _repo.signIn(email: email, password: password);
      await _loadDashboardData();
      _isLoading = false;
      notifyListeners();
      return true;
    } on AuthException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = 'Sign in failed: $e';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> refreshDashboard() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _profile ??= await _repo.fetchParentProfile();
      await _loadDashboardData();
    } catch (e) {
      _errorMessage = 'Failed to load data: $e';
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<void> _loadDashboardData() async {
    final loadedChildren = await _repo.fetchLinkedChildren();
    final loadedAnnouncements = await _repo.fetchAnnouncements();

    _children = loadedChildren;
    if (_selectedChildIndex >= _children.length) {
      _selectedChildIndex = 0;
    }
    _announcements = loadedAnnouncements
        .map((a) => a.copyWith(unread: !_readAnnouncementIds.contains(a.id)))
        .toList();
  }

  Future<bool> linkChild({
    required String linkCode,
    required String rollNumber,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final linkedStudentId = await _repo.linkChild(
        linkCode: linkCode,
        rollNumber: rollNumber,
      );
      await _loadDashboardData();
      final idx = _children.indexWhere((c) => c.id == linkedStudentId);
      if (idx != -1) {
        _selectedChildIndex = idx;
      }
      _isLoading = false;
      notifyListeners();
      return true;
    } on PostgrestException catch (e) {
      _errorMessage = e.message;
    } catch (e) {
      _errorMessage = 'Could not link child: $e';
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> sendPasswordReset(String email) => _repo.sendPasswordReset(email);

  Future<void> signOut() async {
    await _repo.signOut();
    _profile = null;
    _children = [];
    _announcements = [];
    _selectedChildIndex = 0;
    _errorMessage = null;
    notifyListeners();
  }

  void selectChild(int index) {
    if (index < 0 || index >= _children.length) return;
    _selectedChildIndex = index;
    notifyListeners();
  }

  void markAnnouncementRead(String id) {
    _readAnnouncementIds.add(id);
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
}
