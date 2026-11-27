import 'package:flutter/material.dart';
import 'navigation/app_router.dart';
import 'state/app_state.dart';
import 'state/app_state_scope.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const ParentBridgeApp());
}

class ParentBridgeApp extends StatefulWidget {
  const ParentBridgeApp({super.key});

  @override
  State<ParentBridgeApp> createState() => _ParentBridgeAppState();
}

class _ParentBridgeAppState extends State<ParentBridgeApp> {
  final AppState _appState = AppState();

  @override
  void dispose() {
    _appState.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppStateScope(
      state: _appState,
      child: MaterialApp(
        title: 'ParentBridge',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light,
        initialRoute: AppRoutes.login,
        onGenerateRoute: AppRouter.onGenerateRoute,
      ),
    );
  }
}
