import 'package:flutter/material.dart';
import 'package:real_commutrade/screens/register_page.dart';
import 'package:real_commutrade/screens/main_nav_page.dart'; // Import the main navigation page

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  // Controllers to manage the text in the input fields
  final TextEditingController _matrixNumberController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  // State variable to show a loading indicator during network calls
  bool _isLoading = false;

  // State variable to hold the error message
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    // Add listeners to clear the error message when the user types
    _matrixNumberController.addListener(_clearError);
    _passwordController.addListener(_clearError);
  }

  // A helper function to clear the error message
  void _clearError() {
    if (_errorMessage != null) {
      setState(() {
        _errorMessage = null;
      });
    }
  }

  // This function will be called when the main "Login" button is pressed.
  void _login() async {
    // Check if the app is already busy
    if (_isLoading) return;

    final String matrixNumber = _matrixNumberController.text.trim();
    final String password = _passwordController.text.trim();

    if (matrixNumber.isEmpty || password.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter both matrix number and password.';
      });
      return;
    }

    // New password length validation check
    if (password.length < 6) {
      setState(() {
        _errorMessage = 'Password must be at least 6 characters long.';
      });
      return;
    }

    // Set loading state to true to show the indicator
    setState(() {
      _isLoading = true;
    });

    // TODO: Implement the logic to call your AWS API Gateway to log in.
    // For now, we'll simulate a network delay and a successful login.
    try {
      await Future.delayed(const Duration(seconds: 2));

      // Simulating a successful login
      print('Login successful with Matrix Number: $matrixNumber');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Login successful!')),
      );

      // This is the crucial line: it navigates to the MainNavPage
      // and replaces the current page, so the user can't go back.
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const MainNavPage()),
      );

    } catch (e) {
      setState(() {
        _errorMessage = 'Login failed: ${e.toString().replaceAll('Exception: ', '')}';
      });
    } finally {
      // Set loading state back to false
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: Center(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                // App logo from assets folder
                Center(
                  child: Image.asset(
                    'assets/CommuTrade.png', // Assuming your logo is in assets/images/logo.png
                    height: 150,
                  ),
                ),
                const SizedBox(height: 16.0),
                const Text(
                  'CommuTrade',
                  style: TextStyle(
                    fontSize: 42,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF2C3E50),
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 64.0),

                TextField(
                  controller: _matrixNumberController,
                  decoration: InputDecoration(
                    labelText: 'Matrix Number',
                    prefixIcon: const Icon(Icons.person),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 16.0),

                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: InputDecoration(
                    labelText: 'Password',
                    prefixIcon: const Icon(Icons.lock),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12.0),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),

                if (_errorMessage != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 8.0),
                    child: Text(
                      _errorMessage!,
                      style: const TextStyle(
                        color: Colors.red,
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),

                const SizedBox(height: 32.0),

                SizedBox(
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _login,
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12.0),
                      textStyle: const TextStyle(fontSize: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      backgroundColor: const Color(0xFF2C3E50),
                      foregroundColor: Colors.white,
                    ),
                    child: _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('Login'),
                  ),
                ),
                const SizedBox(height: 16.0),

                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Don\'t have an account?',
                      style: TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                    TextButton(
                      // This onPressed function now navigates to the RegisterPage
                      onPressed: _isLoading ? null : () {
                        Navigator.of(context).push(
                          MaterialPageRoute(builder: (context) => const RegisterPage()),
                        );
                      },
                      child: const Text(
                        'Register',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Color(0xFF3498DB),
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 48.0),

                Text(
                  '© 2025 CommuTrade. All Rights Reserved.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 12,
                    color: Colors.grey,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _matrixNumberController.removeListener(_clearError);
    _passwordController.removeListener(_clearError);
    _matrixNumberController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
