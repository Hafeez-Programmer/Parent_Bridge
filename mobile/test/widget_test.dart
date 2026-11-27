import 'package:flutter_test/flutter_test.dart';
import 'package:parent_bridge/main.dart';

void main() {
  testWidgets('ParentBridge app boots to Login screen and navigates to Home',
      (WidgetTester tester) async {
    await tester.pumpWidget(const ParentBridgeApp());
    await tester.pumpAndSettle();

    expect(find.text('ParentBridge'), findsOneWidget);
    expect(find.text('Parent Portal'), findsOneWidget);
    expect(find.text('Login'), findsOneWidget);

    await tester.tap(find.text('Login'));
    await tester.pumpAndSettle();

    expect(find.text('Home'), findsWidgets);
    expect(find.text('Ali Khan · Class 8-A'), findsOneWidget);
  });
}
