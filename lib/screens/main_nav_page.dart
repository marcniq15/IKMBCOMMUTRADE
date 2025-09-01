import 'package:flutter/material.dart';
import 'package:real_commutrade/screens/home_page.dart';
import 'package:real_commutrade/screens/chat_page.dart';
import 'package:real_commutrade/screens/marketplace_page.dart';
import 'package:real_commutrade/screens/profile_page.dart';

class MainNavPage extends StatefulWidget {
  const MainNavPage({Key? key}) : super(key: key);

  @override
  State<MainNavPage> createState() => _MainNavPageState();
}

class _MainNavPageState extends State<MainNavPage> {
  // A state variable to keep track of the currently selected tab index
  int _selectedIndex = 0;

  // A controller for the PageView, allowing for programmatic navigation
  late PageController _pageController;

  // A list of the widgets (pages) to display
  static const List<Widget> _pages = <Widget>[
    HomePage(),
    ChatPage(),
    MarketplacePage(),
    ProfilePage(),
  ];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _selectedIndex);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  // A function to handle taps on the BottomNavigationBar items
  void _onItemTapped(int index) {
    // Note: The floating action button is at index 2, so we need to adjust
    // the indices for the bottom navigation bar to work correctly.
    if (index == 2) {
      // This is the floating action button, so we do nothing here.
      return;
    }

    setState(() {
      _selectedIndex = index > 2 ? index - 1 : index;
      _pageController.animateToPage(
        _selectedIndex,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    });
  }

  // A function to handle the action of the FloatingActionButton
  void _onAddButtonPressed() {
    // TODO: Implement the logic for the "plus button" here
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Add button pressed!'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // The body is now a PageView to enable swiping
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() {
            _selectedIndex = index;
          });
        },
        children: _pages,
      ),
      // The Floating Action Button for the centered "plus" icon
      floatingActionButton: FloatingActionButton(
        onPressed: _onAddButtonPressed,
        backgroundColor: const Color(0xFF2C3E50),
        child: const Icon(Icons.add, color: Colors.white),
      ),
      // Position the Floating Action Button in the center
      floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
      // The bottom navigation bar with the notch for the FAB
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8.0,
        color: Colors.white,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: <Widget>[
            IconButton(
              icon: Icon(
                Icons.home_outlined,
                color: _selectedIndex == 0 ? const Color(0xFF2C3E50) : Colors.grey,
              ),
              onPressed: () => _onItemTapped(0),
            ),
            IconButton(
              icon: Icon(
                Icons.chat_bubble_outline,
                color: _selectedIndex == 1 ? const Color(0xFF2C3E50) : Colors.grey,
              ),
              onPressed: () => _onItemTapped(1),
            ),
            // The empty space for the Floating Action Button
            const SizedBox(width: 48),
            IconButton(
              icon: Icon(
                Icons.storefront,
                color: _selectedIndex == 2 ? const Color(0xFF2C3E50) : Colors.grey,
              ),
              onPressed: () => _onItemTapped(3), // Adjusted index for Marketplace
            ),
            IconButton(
              icon: Icon(
                Icons.person_outline,
                color: _selectedIndex == 3 ? const Color(0xFF2C3E50) : Colors.grey,
              ),
              onPressed: () => _onItemTapped(4), // Adjusted index for Profile
            ),
          ],
        ),
      ),
    );
  }
}
