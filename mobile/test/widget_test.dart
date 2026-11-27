import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:parent_bridge/main.dart';
import 'package:parent_bridge/models/parent_bridge_models.dart';
import 'package:parent_bridge/navigation/app_router.dart';
import 'package:parent_bridge/services/supabase_repository.dart';
import 'package:parent_bridge/state/app_state.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class _FakeSupabaseRepository extends SupabaseRepository {
  @override
  Session? get currentSession => null;

  @override
  Future<ParentProfile> signIn({
    required String email,
    required String password,
  }) async =>
      const ParentProfile(
        id: 'p1',
        fullName: 'Nadia Raza',
        email: 'nadia@mail.com',
        role: 'parent',
        isActive: true,
      );

  @override
  Future<List<ChildProfile>> fetchLinkedChildren() async => const [
        ChildProfile(
          id: 'c1',
          name: 'Ali Khan',
          classId: 'cls1',
          className: 'Class 8-A',
          rollNumber: '01',
          attendancePercent: 92,
          lastResultPercent: 78,
          todayStatus: AttendanceStatus.present,
          presentCount: 21,
          absentCount: 2,
          lateCount: 1,
          recentDays: [
            AttendanceDayRecord(dateLabel: 'Today', status: AttendanceStatus.present),
          ],
          exams: [],
        ),
      ];

  @override
  Future<List<Announcement>> fetchAnnouncements() async => const [];
}

void main() {
  testWidgets('ParentBridge signs in via repository and navigates to Home',
      (WidgetTester tester) async {
    final appState = AppState(repository: _FakeSupabaseRepository());

    await tester.pumpWidget(
      ParentBridgeApp(
        appState: appState,
        initialRoute: AppRoutes.login,
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('ParentBridge'), findsOneWidget);
    expect(find.text('Parent Portal'), findsOneWidget);

    await tester.enterText(find.byType(TextFormField).last, 'password123');
    await tester.tap(find.text('Login'));
    await tester.pumpAndSettle();

    expect(find.text('Home'), findsWidgets);
    expect(find.text('Ali Khan · Class 8-A'), findsOneWidget);
  });
}
