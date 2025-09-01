import 'package:flutter/material.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({Key? key}) : super(key: key);

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  // Controllers to manage the text in the input fields
  final TextEditingController _fullNameController = TextEditingController();
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
    _fullNameController.addListener(_clearError);
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

  // This function will be called when the main "Register" button is pressed.
  void _register() async {
    // Check if the app is already busy
    if (_isLoading) return;

    final String fullName = _fullNameController.text.trim();
    final String matrixNumber = _matrixNumberController.text.trim();
    final String password = _passwordController.text.trim();

    if (fullName.isEmpty || matrixNumber.isEmpty || password.isEmpty) {
      setState(() {
        _errorMessage = 'Please fill in all fields.';
      });
      return;
    }

    // Password length validation check
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

    // TODO: Implement the logic to call your AWS API Gateway to register the user.
    // For now, we'll simulate a network delay and a registration failure.
    try {
      await Future.delayed(const Duration(seconds: 2));
      // Simulate a registration failure for demonstration
      throw Exception('Matrix number already exists.');

      // If registration was successful, this code would run:
      // print('Registration successful for Full Name: $fullName, Matrix Number: $matrixNumber');
      // ScaffoldMessenger.of(context).showSnackBar(
      //   const SnackBar(content: Text('Registration successful!')),
      // );
      // TODO: Navigate the user back to the login page after successful registration
    } catch (e) {
      setState(() {
        _errorMessage = 'Registration failed: ${e.toString().replaceAll('Exception: ', '')}';
      });
    } finally {
      // Set loading state back to false
      setState(() {
        _isLoading = false;
      });
    }
  }

  // This function will be called when the "Login" text button is pressed.
  void _login() {
    if (_isLoading) return;
    // This will pop the current page off the navigation stack, returning to the previous page (LoginPage).
    Navigator.of(context).pop();
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

                // Full Name Text Field
                TextField(
                  controller: _fullNameController,
                  decoration: InputDecoration(
                    labelText: 'Full Name',
                    prefixIcon: const Icon(Icons.person_outline),
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

                // Display an error message if one exists, moved below the password field
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

                // Primary "Register" Button
                SizedBox(
                  height: 50,
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _register,
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
                        : const Text('Register'),
                  ),
                ),
                const SizedBox(height: 16.0),

                // "Login" Text Link
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text(
                      'Already have an account?',
                      style: TextStyle(fontSize: 16, color: Colors.grey),
                    ),
                    TextButton(
                      onPressed: _isLoading ? null : _login,
                      child: const Text(
                        'Login',
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

                // Copyright Notice
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
    _fullNameController.removeListener(_clearError);
    _matrixNumberController.removeListener(_clearError);
    _passwordController.removeListener(_clearError);
    _fullNameController.dispose();
    _matrixNumberController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
