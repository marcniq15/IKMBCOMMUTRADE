import 'package:flutter/material.dart';

// The ItemPage is now a StatefulWidget to manage the favourite state.
class ItemPage extends StatefulWidget {
  // This page requires a Map of the item's details to display.
  final Map<String, String> item;

  const ItemPage({
    Key? key,
    required this.item,
  }) : super(key: key);

  @override
  State<ItemPage> createState() => _ItemPageState();
}

class _ItemPageState extends State<ItemPage> {
  // This state variable will manage the favourite status of the item.
  bool _isFavourited = false;

  // Placeholder data for ratings and reviews
  final double _rating = 4.5;
  final int _numberOfReviews = 120;

  // A list of placeholder review data. The user names have been changed.
  final List<Map<String, String>> _reviews = [
    {
      'user': 'Placeholder User 1',
      'rating': '5.0',
      'comment': 'Great product! Exactly as described and fast delivery.',
    },
    {
      'user': 'Placeholder User 2',
      'rating': '4.0',
      'comment': 'Good quality, but took a bit longer to arrive than expected.',
    },
    {
      'user': 'Placeholder User 3',
      'rating': '5.0',
      'comment': 'Excellent! The seller was very responsive and helpful.',
    },
  ];

  // A helper function to build the star rating icons.
  Widget _buildStarRating(double rating) {
    List<Widget> stars = [];
    int fullStars = rating.floor();
    bool hasHalfStar = (rating - fullStars) >= 0.5;

    for (int i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.add(const Icon(Icons.star, color: Colors.amber, size: 20));
      } else if (i == fullStars && hasHalfStar) {
        stars.add(const Icon(Icons.star_half, color: Colors.amber, size: 20));
      } else {
        stars.add(const Icon(Icons.star_border, color: Colors.amber, size: 20));
      }
    }
    return Row(children: stars);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.item['title']!,
          style: const TextStyle(color: Colors.white),
        ),
        backgroundColor: const Color(0xFF2C3E50),
        iconTheme: const IconThemeData(color: Colors.white), // Set back button color to white
        actions: [
          // This is the Favourites/Wishlist icon. Tapping it toggles the state.
          IconButton(
            icon: Icon(
              _isFavourited ? Icons.favorite : Icons.favorite_border,
              color: _isFavourited ? Colors.red : Colors.white,
            ),
            onPressed: () {
              setState(() {
                _isFavourited = !_isFavourited;
              });
              // Show a snackbar message based on the action
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(_isFavourited ? 'Added to Favourites!' : 'Removed from Favourites!'),
                  duration: const Duration(milliseconds: 1500),
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            // Display the item image
            SizedBox(
              height: 300,
              child: Image.network(
                widget.item['image']!,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    color: Colors.grey[300],
                    child: const Center(
                      child: Icon(Icons.image_not_supported, color: Colors.grey, size: 50),
                    ),
                  );
                },
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  // Display the item title
                  Text(
                    widget.item['title']!,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  // Display the item price
                  Text(
                    widget.item['price']!,
                    style: const TextStyle(
                      fontSize: 24,
                      color: Color(0xFF3498DB),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  // Display the ratings and number of reviews
                  Row(
                    children: [
                      _buildStarRating(_rating),
                      const SizedBox(width: 8.0),
                      Text(
                        '$_rating ($_numberOfReviews Reviews)',
                        style: const TextStyle(fontSize: 16, color: Colors.black54),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16.0),
                  // Placeholder for a detailed description
                  const Text(
                    'This is a placeholder for a detailed product description. It provides more information about the item, its features, and specifications. You can add more text here once you have a real product database.',
                    style: TextStyle(
                      fontSize: 16,
                      height: 1.5,
                      color: Colors.black54,
                    ),
                  ),
                  const SizedBox(height: 24.0),
                  // The new "Customer Reviews" section
                  const Text(
                    'Customer Reviews',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  // Display the placeholder reviews
                  ..._reviews.map((review) => ReviewCard(review: review)),
                  const SizedBox(height: 16.0),
                  // A button to allow users to write a review
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: OutlinedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Write a review!')),
                        );
                      },
                      style: OutlinedButton.styleFrom(
                        foregroundColor: const Color(0xFF2C3E50),
                        side: const BorderSide(color: Color(0xFF2C3E50), width: 2),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Write a Review'),
                    ),
                  ),
                  const SizedBox(height: 24.0),
                  // "Add to Cart" button, which is now at the bottom
                  SizedBox(
                    width: double.infinity,
                    height: 50,
                    child: ElevatedButton(
                      onPressed: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Item added to cart!')),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF2C3E50),
                        foregroundColor: Colors.white,
                        textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Add to Cart'),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// A new widget to display a single review card.
class ReviewCard extends StatelessWidget {
  final Map<String, String> review;

  const ReviewCard({Key? key, required this.review}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2.0,
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12.0),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  review['user']!,
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 16.0,
                  ),
                ),
                _buildStarRating(double.parse(review['rating']!)),
              ],
            ),
            const SizedBox(height: 8.0),
            Text(
              review['comment']!,
              style: const TextStyle(fontSize: 14.0),
            ),
          ],
        ),
      ),
    );
  }

  // A helper function to build the star rating icons.
  Widget _buildStarRating(double rating) {
    List<Widget> stars = [];
    int fullStars = rating.floor();
    for (int i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.add(const Icon(Icons.star, color: Colors.amber, size: 16));
      } else {
        stars.add(const Icon(Icons.star_border, color: Colors.amber, size: 16));
      }
    }
    return Row(children: stars);
  }
}
