import 'package:flutter/material.dart';
import 'package:real_commutrade/screens/item_page.dart'; // Import the new item page

class MarketplacePage extends StatefulWidget {
  const MarketplacePage({Key? key}) : super(key: key);

  @override
  State<MarketplacePage> createState() => _MarketplacePageState();
}

class _MarketplacePageState extends State<MarketplacePage> {
  // State variable to toggle the search bar visibility
  bool _isSearching = false;

  // A list of placeholder items to populate the grid
  final List<Map<String, String>> marketplaceItems = const [
    {'title': 'Placeholder', 'price': 'RM 00.00', 'image': 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Item+1'},
    {'title': 'Placeholder', 'price': 'RM 00.00', 'image': 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Item+2'},
    {'title': 'Placeholder', 'price': 'RM 00.00', 'image': 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Item+3'},
    {'title': 'Placeholder', 'price': 'RM 00.00', 'image': 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Item+4'},
    {'title': 'Placeholder', 'price': 'RM 00.00', 'image': 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Item+5'},
    {'title': 'Placeholder', 'price': 'RM 00.00', 'image': 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Item+6'},
    {'title': 'Placeholder', 'price': 'RM 00.00', 'image': 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Item+7'},
    {'title': 'Placeholder', 'price': 'RM 00.00', 'image': 'https://placehold.co/600x400/2C3E50/FFFFFF?text=Item+8'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: _isSearching
            ? SizedBox(
          height: 40,
          child: TextField(
            decoration: InputDecoration(
              hintText: 'Search the marketplace...',
              hintStyle: const TextStyle(color: Colors.white70),
              prefixIcon: const Icon(Icons.search, color: Colors.white),
              filled: true,
              fillColor: const Color(0xFF34495E),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(20),
                borderSide: BorderSide.none,
              ),
              contentPadding: EdgeInsets.zero,
            ),
            style: const TextStyle(color: Colors.white),
          ),
        )
            : const Text(
          'Marketplace',
          style: TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF2C3E50),
        actions: <Widget>[
          // Show search icon when not searching, and close icon when searching
          IconButton(
            icon: Icon(
              _isSearching ? Icons.close : Icons.search,
              color: Colors.white,
            ),
            onPressed: () {
              setState(() {
                _isSearching = !_isSearching;
              });
            },
          ),
          // Show filter icon only when the search bar is active
          if (_isSearching)
            IconButton(
              icon: const Icon(Icons.filter_list, color: Colors.white),
              onPressed: () {
                // TODO: Implement search filtering logic
              },
            ),
          // The cart icon is always visible
          IconButton(
            icon: const Icon(Icons.shopping_cart, color: Colors.white),
            onPressed: () {
              // TODO: Implement navigation to cart page
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Cart button pressed!'),
                ),
              );
            },
          ),
        ],
      ),
      // The body of the page is a GridView as before
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: GridView.builder(
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 8.0,
            mainAxisSpacing: 8.0,
            childAspectRatio: 0.75,
          ),
          itemCount: marketplaceItems.length,
          itemBuilder: (context, index) {
            final item = marketplaceItems[index];
            return InkWell(
              onTap: () {
                // Navigate to the ItemPage when the card is tapped
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => ItemPage(item: item),
                  ),
                );
              },
              child: Card(
                elevation: 4.0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Expanded(
                      child: ClipRRect(
                        borderRadius: const BorderRadius.vertical(top: Radius.circular(12.0)),
                        child: Image.network(
                          item['image']!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) {
                            return Container(
                              color: Colors.grey[300],
                              child: const Center(child: Icon(Icons.image_not_supported, color: Colors.grey)),
                            );
                          },
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            item['title']!,
                            style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16.0,
                            ),
                          ),
                          const SizedBox(height: 4.0),
                          Text(
                            item['price']!,
                            style: const TextStyle(
                              color: Colors.grey,
                              fontSize: 14.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
