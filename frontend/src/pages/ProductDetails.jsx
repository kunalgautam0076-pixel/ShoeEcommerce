import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Truck, Undo2 } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, loading } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  
  // Image Zoom States
  const [showZoom, setShowZoom] = useState(false);
  const [lensStyle, setLensStyle] = useState({ display: 'none' });
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  
  // Selected state
  const [selectedSize, setSelectedSize] = useState(null);
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);

  useEffect(() => {
    if (!loading) {
      // Find product either by _id (mongo) or id (fallback)
      const foundProduct = products.find(p => p._id === id || p.id?.toString() === id);
      setProduct(foundProduct);
      setSelectedImgIndex(0); // Reset on product change
    }
  }, [id, products, loading]);

  const handleCheckPincode = async () => {
    if (!pincode || pincode.trim().length < 5) {
      alert("Please enter a valid pincode.");
      return;
    }
    
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode.trim()}`);
      const data = await response.json();
      
      let locationName = "Unknown Location";
      if (data && data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        // Combine the specific area name and the district
        locationName = `${postOffice.Name}, ${postOffice.District}`; 
      } else {
        alert("Invalid pincode.");
        return;
      }

      // Calculate a realistic delivery date (4 days from now)
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 4);
      const options = { weekday: 'short', day: 'numeric', month: 'short' };
      const formattedDate = deliveryDate.toLocaleDateString('en-US', options);

      setDeliveryInfo({
        city: locationName,
        date: formattedDate
      });
    } catch (error) {
      console.error("Error fetching pincode details", error);
      alert("Could not verify pincode. Please try again later.");
    }
  };

  if (loading) return <div className="page-container container"><p>Loading...</p></div>;
  if (!product) return <div className="page-container container"><p>Product not found.</p></div>;

  // Mocking multiple images for the gallery
  const galleryImages = [
    product.image,
    product.image,
    product.image,
    product.image,
    product.image
  ];

  const handleMouseMove = (e) => {
    // Target the actual image to get perfect undistorted dimensions
    const imgElement = e.currentTarget.querySelector('img');
    if (!imgElement) return;

    const { left, top, width, height } = imgElement.getBoundingClientRect();
    
    let mouseX = e.clientX - left;
    let mouseY = e.clientY - top;

    // Lens dimensions
    const lensWidth = 150;
    const lensHeight = 150;

    let lensX = mouseX - lensWidth / 2;
    let lensY = mouseY - lensHeight / 2;

    // Boundaries
    if (lensX < 0) lensX = 0;
    if (lensY < 0) lensY = 0;
    if (lensX > width - lensWidth) lensX = width - lensWidth;
    if (lensY > height - lensHeight) lensY = height - lensHeight;

    setLensStyle({
      display: 'block',
      left: `${lensX}px`,
      top: `${lensY}px`,
      width: `${lensWidth}px`,
      height: `${lensHeight}px`
    });

    // Calculate background position percentage for the zoom window
    const bgPosX = (lensX / (width - lensWidth)) * 100;
    const bgPosY = (lensY / (height - lensHeight)) * 100;
    const zoomRatio = 2.5; // Magnification level

    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${galleryImages[selectedImgIndex]})`,
      backgroundPosition: `${bgPosX}% ${bgPosY}%`,
      // Using 'auto' for height strictly prevents ANY image stretching distortion!
      backgroundSize: `${width * zoomRatio}px auto` 
    });
  };

  const defaultSizes = product.sizes && product.sizes.length > 0 ? product.sizes : [6, 7, 8, 9, 10, 11];

  return (
    <div className="product-details-page container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> &gt; <Link to={`/collections?category=${product.category}`}>{product.category}</Link> &gt; <span>{product.name}</span>
      </div>

      <div className="product-layout">
        
        {/* Left: Thumbnails */}
        <div className="thumbnails-container">
          {galleryImages.map((img, index) => (
            <div 
              className={`thumbnail-box ${selectedImgIndex === index ? 'active' : ''}`} 
              key={index}
              onClick={() => setSelectedImgIndex(index)}
            >
              <img src={img} alt={`${product.name} ${index}`} />
            </div>
          ))}
        </div>

        {/* Middle: Main Image */}
        <div className="main-image-container">
          <div 
            className="image-wrapper"
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => {
              setShowZoom(false);
              setLensStyle({ display: 'none' });
              setZoomStyle({ display: 'none' });
            }}
            onMouseMove={handleMouseMove}
          >
            <img src={galleryImages[selectedImgIndex]} alt={product.name} className="main-image" />
            <div className="zoom-lens" style={lensStyle}></div>
          </div>
        </div>

        {/* Right: Product Info & Zoom Portal */}
        <div className="product-info-container">
          
          {/* Zoom Portal overlay - shows up when hovering main image */}
          {showZoom && (
            <div className="zoom-portal" style={zoomStyle}></div>
          )}

          {/* Normal Info */}
          <div className={`info-content ${showZoom ? 'hidden-opacity' : ''}`}>
            <p className="brand-label">Just In - {product.brand}</p>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-category">{product.category} Shoes</p>
            
            <p className="product-price">
              ${product.price.toFixed(2)}
              <span className="tax-info">Inclusive of all taxes</span>
            </p>

            <div className="size-section">
              <div className="size-header">
                <span className="select-size-label">Select Size</span>
                <span className="size-guide">Size Guide</span>
              </div>
              <div className="size-grid">
                {defaultSizes.map(size => (
                  <button 
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    UK {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="action-buttons">
              <button className="add-to-bag-btn">
                Add to Bag
              </button>
              <button className="favourite-btn">
                Favourite <Heart size={20} />
              </button>
            </div>

            <div className="product-description">
              <p>{product.description}</p>
              <ul>
                <li>Colour Shown: Multi-color / Default</li>
                <li>Style: SHX-{product._id?.slice(-6) || '10293'}</li>
              </ul>
              <button className="view-details-btn">View Product Details</button>
            </div>

            <div className="delivery-section">
              {!deliveryInfo ? (
                <>
                  <h3>Check delivery date</h3>
                  <p>Enter pincode to know exact delivery dates/charges</p>
                  <div className="pincode-input-group">
                    <input 
                      type="text" 
                      placeholder="Pincode" 
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCheckPincode()}
                    />
                    <button onClick={handleCheckPincode}>Check</button>
                  </div>
                </>
              ) : (
                <div className="delivery-result">
                  <h3 className="delivery-date-text">Delivery by {deliveryInfo.date}</h3>
                  <div className="delivery-location-row">
                    <span className="location-text">To {pincode}, {deliveryInfo.city}</span>
                    <button className="change-pincode-btn" onClick={() => { setDeliveryInfo(null); setPincode(''); }}>Change</button>
                  </div>
                </div>
              )}
              
              <div className="delivery-perks">
                <div className="perk">
                  <div className="perk-left">
                    <Undo2 size={20} />
                    <span>14-day return and size exchange</span>
                  </div>
                  <a href="#" className="know-more-link">Know More</a>
                </div>
                <div className="perk">
                  <div className="perk-left">
                    <Truck size={20} />
                    <span>Free delivery available</span>
                  </div>
                  <a href="#" className="know-more-link">Know More</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
