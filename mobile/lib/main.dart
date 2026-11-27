import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'config/supabase_config.dart';
import 'navigation/app_router.dart';
import 'state/app_state.dart';
import 'state/app_state_scope.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: SupabaseConfig.url,
    publishableKey: SupabaseConfig.publishableKey,
  );

  final appState = AppState();
  await appState.initialize();

  runApp(ParentBridgeApp(appState: appState));
}

class ParentBridgeApp extends StatefulWidget {
  const ParentBridgeApp({super.key, this.appState, this.initialRoute});

  final AppState? appState;
  final String? initialRoute;

  @override
  State<ParentBridgeApp> createState() => _ParentBridgeAppState();
}

class _ParentBridgeAppState extends State<ParentBridgeApp> {
  late final AppState _appState;
  late final bool _ownsState;

  @override
  void initState() {
    super.initState();
    _ownsState = widget.appState == null;
    _appState = widget.appState ?? AppState();
  }

  @override
  void dispose() {
    if (_ownsState) {
      _appState.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final route = widget.initialRoute ??
        (_appState.hasSession ? AppRoutes.main : AppRoutes.login);

    return AppStateScope(
      state: _appState,
      child: MaterialApp(
        title: 'ParentBridge',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        initialRoute: route,
        onGenerateRoute: AppRouter.onGenerateRoute,
      ),
    );
  }
}
