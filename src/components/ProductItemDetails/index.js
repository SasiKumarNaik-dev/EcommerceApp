// Write your code here
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {productData: {}, quantity: 1, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, option)
    const data = await response.json()
    if (response.ok) {
      data.similar_products.map(() => console.log('sasi'))
      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products,
        style: data.style,
        title: data.title,
        totalReviews: data.total_reviews,
      }
      this.setState({
        productData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  decrementQuantity = () => {
    const {productData} = this.state
    console.log(productData.similarProducts[0])
    this.setState(prevState => {
      if (prevState.quantity > 1) {
        return {quantity: prevState.quantity - 1}
      }
      return {quantity: prevState.quantity}
    })
  }

  incrementQuantity = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  getSimilarProducts = () => {
    const {productData, quantity} = this.state
    const {
      imageUrl,
      availability,
      brand,
      description,
      price,
      rating,
      title,
      similarProducts,
      totalReviews,
    } = productData
    let updatedSimilarProducts = []
    if (similarProducts && similarProducts.length > 0) {
      updatedSimilarProducts = similarProducts.map(item => ({
        title: item.title,
        brand: item.brand,
        price: item.price,
        imageUrl: item.image_url,
        id: item.id,
        rating: item.rating,
      }))
      console.log(updatedSimilarProducts)
    }
    return (
      <>
        <Header />
        <div className="product-details-div">
          <div className="img-div">
            <img src={imageUrl} alt="product" className="product-img" />
          </div>
          <div className="content-div">
            <h1 className="item-title">{title}</h1>
            <p className="item-price">Rs {price}/-</p>
            <div className="rr-div">
              <div className="item-rating-container">
                <p className="item-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>

            <p className="item-description">{description}</p>
            <p className="item-avail-brand">
              <span className="side-head">Available:</span> {availability}
            </p>
            <p className="item-avail-brand">
              <span className="side-head">Brand:</span> {brand}
            </p>
            <hr className="horizontal" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-btn"
                onClick={this.decrementQuantity}
                data-testid="minus"
              >
                <BsDashSquare />
              </button>
              <p className="quantity">{quantity}</p>
              <button
                type="button"
                className="quantity-btn"
                onClick={this.incrementQuantity}
                data-testid="plus"
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-div">
          <h1 className="similar-heading">Similar Products</h1>
          <ul className="sp-ul">
            {updatedSimilarProducts && updatedSimilarProducts.length > 0
              ? updatedSimilarProducts.map(eachItem => (
                  <SimilarProductItem item={eachItem} key={eachItem.id} />
                ))
              : null}
          </ul>
        </div>
      </>
    )
  }

  getLoadingView = () => (
    <div className="primedeals-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  getFailureView = () => (
    <div className="failure-div">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png "
        alt="failure view"
        className="error-img"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="failure-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getSimilarProducts()
      case apiStatusConstants.failure:
        return this.getFailureView()
      case apiStatusConstants.inProgress:
        return this.getLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
