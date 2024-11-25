import Button from '../Button/Button'
import './Card.css'

export default function Card({ title, money, buttonText, buttonType ,handleClick, success=true }) {
    return (
        <div className="card">
            <h3 className="cardTitle">
                {`${title}: `}
                <span className={success ? 'success' : 'failure'}>
                    {`₹${money}`}
                </span>
            </h3>
            <Button handleClick={handleClick} style={buttonType}>{buttonText}</Button>
        </div>
    )
}