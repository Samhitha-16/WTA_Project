
<!-- ------------------------------------------------ -->

<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Establish database connection

$host = 'localhost';
$username = 'root';
$password = '';
$database = 'my_cart';
$conn = mysqli_connect('localhost', 'root', '', 'my_cart');
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

// Handle the "Place Order" request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Retrieve cart data from the request body
  $cartData = $_POST['cartData'];

  // Convert $cartData to an array
  $cartDataArray = json_decode($cartData, true);

  // Insert cart data into the database
  foreach ($cartDataArray as $item) {
    $title = mysqli_real_escape_string($conn, $item['title']);
    $price = mysqli_real_escape_string($conn, $item['price']);
    

    $sql = "INSERT INTO orders (title, price) VALUES ('$title', '$price')";
    if (mysqli_query($conn, $sql)) {
      echo "Order placed successfully";
    } else {
      echo "Error placing order: " . mysqli_error($conn);
    }
  }
}

// Fetch all orders from the database
$sql = "SELECT * FROM orders";
$result = mysqli_query($conn, $sql);

// Display orders in a table
echo '<table>';
echo '<thead>';
echo '<tr><th>Title</th><th>Price</th></tr>';
echo '</thead>';
echo '<tbody>';
while ($row = mysqli_fetch_assoc($result)) {
  echo '<tr>';
  echo '<td>' . $row['title'] . '</td>';
  echo '<td>' . $row['price'] . '</td>';
  echo '</tr>';
}
echo '</tbody>';
echo '</table>';

// Close database connection
mysqli_close($conn);
?>
