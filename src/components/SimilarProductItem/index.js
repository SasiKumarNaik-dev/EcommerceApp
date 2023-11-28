// Write your code here

import './index.css'

const SimilarProductItem = props => {
  const {item} = props
  const {brand, title, price, imageUrl, rating} = item
  return (
    <li className="sp-list">
      <img src={imageUrl} alt={`similar product ${title}`} className="sp-img" />
      <h1 className="sp-title">{title}</h1>
      <p className="sp-brand">by {brand}</p>
      <div className="sp-bottom">
        <p className="sp-price">{price}/-</p>
        <div className="sp-rating-div">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="sp-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
