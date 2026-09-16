import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingCart, Truck, Undo2, X } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { products, loading, error } = useContext(ProductContext);
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [product, setProduct] = useState(null);
  
  // Image Zoom States
  const [showZoom, setShowZoom] = useState(false);
  const [lensStyle, setLensStyle] = useState({ display: 'none' });
  const [zoomStyle, setZoomStyle] = useState({ display: 'none' });
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  
  // Selected state
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [sizeUnit, setSizeUnit] = useState('in');
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [addedMessage, setAddedMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Find product either by _id (mongo) or id (fallback)
      const foundProduct = products.find(p => p._id === id || p.id?.toString() === id);
      setProduct(foundProduct);
      setSelectedImgIndex(0); // Reset on product change
    }
  }, [id, products, loading]);

  useEffect(() => {
    if (!showSizeGuide) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') setShowSizeGuide(false);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showSizeGuide]);

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      setFeedbackType('warning');
      setAddedMessage('Please select a size before adding to bag.');
      return;
    }

    addToCart(product, selectedSize);
    setFeedbackType('success');
    setAddedMessage(`Added UK ${selectedSize} to your bag.`);
    setShowMiniCart(true);
  };

  const handleFavourite = () => {
    if (!selectedSize) {
      setFeedbackType('warning');
      setAddedMessage('Please select a size before adding to favourites.');
      return;
    }

    setIsFavourite((currentValue) => !currentValue);
    setFeedbackType('success');
    setAddedMessage(isFavourite ? 'Removed from favourites.' : 'Added to favourites.');
  };

  if (loading) return <div className="page-container container"><p>Loading...</p></div>;
  if (!product) return <div className="page-container container"><p>Product not found.</p></div>;

  const galleryImages = product.images?.length ? product.images : [product.image];

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

  const defaultSizes = [6, 7, 8, 9, 10, 11, 12];
  const sizeGuideRows = [
    { uk: 'UK 6 (EU 40)', inches: '9.6', cm: '24.5', us: '7', eu: '40', jp: '25' },
    { uk: 'UK 7', inches: '10', cm: '25.4', us: '8', eu: '41', jp: '26' },
    { uk: 'UK 8', inches: '10.3', cm: '26.2', us: '9', eu: '42.5', jp: '27' },
    { uk: 'UK 9', inches: '10.7', cm: '27.1', us: '10', eu: '44', jp: '28' },
    { uk: 'UK 10', inches: '11', cm: '27.9', us: '11', eu: '45', jp: '29' },
    { uk: 'UK 11', inches: '11.3', cm: '28.8', us: '12', eu: '46', jp: '30' },
    { uk: 'UK 12', inches: '11.7', cm: '29.6', us: '13', eu: '47.5', jp: '31' }
  ];

  return (
    <div className="product-details-page container">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> &gt; <Link to={`/collections?category=${product.category}`}>{product.category}</Link> &gt; <span>{product.name}</span>
      </div>

      {error && <p className="data-notice" role="status">Live product service is unavailable. Showing demo product data.</p>}

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
            <p className="product-category">
              {product.category} Shoes{selectedSize ? ` (UK ${selectedSize})` : ''}
            </p>
            
            <p className="product-price">
              ${product.price.toFixed(2)}
              <span className="tax-info">Inclusive of all taxes</span>
            </p>

            <div className="size-section">
              <div className="size-header">
                <span className="select-size-label">Select Size</span>
                <button className="size-guide" type="button" onClick={() => setShowSizeGuide(true)}>
                  Size Guide
                </button>
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
              <button className="add-to-bag-btn" onClick={handleAddToCart}>
                Add to Bag
              </button>
              <button className={`favourite-btn ${isFavourite ? 'favourite-selected' : ''}`} onClick={handleFavourite}>
                {isFavourite ? 'Favourited' : 'Favourite'} <Heart size={20} fill={isFavourite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {addedMessage && <p className={`cart-feedback ${feedbackType}`} role="status">{addedMessage}</p>}

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

      {showMiniCart && selectedSize && (() => {
        const productId = product._id || product.id;
        const miniCartItem = cartItems.find((item) => item.productId === productId && item.size === selectedSize);

        if (!miniCartItem) return null;

        return (
          <aside className="mini-cart" aria-label="Added product preview">
            <div className="mini-cart-header">
              <span><ShoppingCart size={17} /> Added to bag</span>
              <button type="button" onClick={() => setShowMiniCart(false)} aria-label="Close added product preview">
                <X size={18} />
              </button>
            </div>
            <div className="mini-cart-product">
              <img src={miniCartItem.image} alt={miniCartItem.name} />
              <div>
                <strong>{miniCartItem.name}</strong>
                <span>UK {miniCartItem.size}</span>
                <span>${miniCartItem.price.toFixed(2)}</span>
              </div>
            </div>
            <div className="mini-cart-footer">
              <div className="mini-quantity" aria-label="Mini cart quantity">
                <button type="button" onClick={() => updateQuantity(miniCartItem.itemId, miniCartItem.quantity - 1)} aria-label="Decrease quantity">
                  <Minus size={14} />
                </button>
                <span>{miniCartItem.quantity}</span>
                <button type="button" onClick={() => updateQuantity(miniCartItem.itemId, miniCartItem.quantity + 1)} aria-label="Increase quantity">
                  <Plus size={14} />
                </button>
              </div>
              <Link className="mini-cart-link" to="/cart" onClick={() => setShowMiniCart(false)}>View Bag</Link>
            </div>
          </aside>
        );
      })()}

      {showSizeGuide && (
        <div
          className="size-guide-backdrop"
          role="presentation"
          onMouseDown={(event) => event.target === event.currentTarget && setShowSizeGuide(false)}
        >
          <section className="size-guide-modal" role="dialog" aria-modal="true" aria-labelledby="size-guide-title">
            <div className="size-guide-heading">
              <div>
                <h2 id="size-guide-title">Size Guide</h2>
                <p>{product.brand} {product.name} Men's {product.category} Shoes</p>
              </div>
              <button className="size-guide-close" type="button" onClick={() => setShowSizeGuide(false)} aria-label="Close size guide">
                <X size={24} />
              </button>
            </div>

            <div className="size-guide-toolbar">
              <p>Below are product&apos;s physical dimensions</p>
              <div className="unit-toggle" role="group" aria-label="Measurement unit">
                <button className={sizeUnit === 'in' ? 'active' : ''} type="button" onClick={() => setSizeUnit('in')}>in</button>
                <button className={sizeUnit === 'cm' ? 'active' : ''} type="button" onClick={() => setSizeUnit('cm')}>cm</button>
              </div>
            </div>

            <div className="size-guide-table-wrapper">
              <table className="size-guide-table">
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Product Foot Length</th>
                    <th>Product US Size</th>
                    <th>Product EU Size</th>
                    <th>Product CM/JP</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeGuideRows.map((row) => (
                    <tr key={row.uk}>
                      <th scope="row">{row.uk}</th>
                      <td>{sizeUnit === 'in' ? row.inches : row.cm}</td>
                      <td>{row.us}</td>
                      <td>{row.eu}</td>
                      <td>{row.jp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
