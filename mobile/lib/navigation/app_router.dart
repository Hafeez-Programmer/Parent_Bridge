import 'package:flutter/material.dart';
import '../models/parent_bridge_models.dart';
import '../screens/announcement_detail_screen.dart';
import '../screens/announcements_screen.dart';
import '../screens/attendance_screen.dart';
import '../screens/child_selector_screen.dart';
import '../screens/home_screen.dart';
import '../screens/link_child_screen.dart';
import '../screens/login_screen.dart';
import '../screens/result_detail_screen.dart';
import '../screens/results_screen.dart';
import '../screens/settings_screen.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

abstract final class AppRoutes {
  static const String login = '/login';
  static const String main = '/main';
  static const String linkChild = '/link-child';
  static const String childSelector = '/child-selector';
  static const String resultDetail = '/result-detail';
  static const String announcementDetail = '/announcement-detail';
  static const String settings = '/settings';
}

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case AppRoutes.login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case AppRoutes.main:
        final initialTab = (settings.arguments as int?) ?? 0;
        return MaterialPageRoute(
          builder: (_) => MainShellScreen(initialTab: initialTab),
        );
      case AppRoutes.linkChild:
        return MaterialPageRoute(builder: (_) => const LinkChildScreen());
      case AppRoutes.childSelector:
        return MaterialPageRoute(builder: (_) => const ChildSelectorScreen());
      case AppRoutes.resultDetail:
        final exam = settings.arguments as ExamResult;
        return MaterialPageRoute(
          builder: (_) => ResultDetailScreen(exam: exam),
        );
      case AppRoutes.announcementDetail:
        final announcement = settings.arguments as Announcement;
        return MaterialPageRoute(
          builder: (_) => AnnouncementDetailScreen(announcement: announcement),
        );
      case AppRoutes.settings:
        return MaterialPageRoute(builder: (_) => const SettingsScreen());
      default:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
    }
  }
}

class MainShellScreen extends StatefulWidget {
  const MainShellScreen({super.key, this.initialTab = 0});

  final int initialTab;

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  late int _currentIndex;

  static const _titles = ['Home', 'Attendance', 'Results', 'Announcements'];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialTab.clamp(0, 3);
  }

  void _setTab(int index) {
    setState(() => _currentIndex = index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PbAppBar(
        title: _titles[_currentIndex],
        onSettingsPressed: () => Navigator.of(context).pushNamed(AppRoutes.settings),
      ),
      body: IndexedStack(
        index: _currentIndex,
        children: [
          HomeScreen(onNavigateTab: _setTab),
          const AttendanceScreen(),
          const ResultsScreen(),
          const AnnouncementsScreen(),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          color: AppColors.lightSurface,
          border: Border(
            top: BorderSide(color: AppColors.lightOutlineVariant),
          ),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _setTab,
          type: BottomNavigationBarType.fixed,
          backgroundColor: AppColors.lightSurface,
          elevation: 0,
          selectedItemColor: AppColors.lightSecondary,
          unselectedItemColor: AppColors.lightOnSurfaceVariant,
          selectedLabelStyle: AppTypography.labelSm(color: AppColors.lightSecondary),
          unselectedLabelStyle: AppTypography.labelSm(color: AppColors.lightOnSurfaceVariant),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.event_available_outlined),
              activeIcon: Icon(Icons.event_available),
              label: 'Attend.',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.assessment_outlined),
              activeIcon: Icon(Icons.assessment),
              label: 'Results',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.campaign_outlined),
              activeIcon: Icon(Icons.campaign),
              label: 'News',
            ),
          ],
        ),
      ),
    );
  }
}
