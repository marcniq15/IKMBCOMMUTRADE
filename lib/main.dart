import 'package:flutter/material.dart';
import 'package:real_commutrade/screens/login_page.dart';
// Note: We don't need to import main_nav_page.dart here
// because it is only used for navigation from the login page.

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CommuTrade',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // The application starts at the LoginPage.
      home: const LoginPage(),
    );
  }
}
