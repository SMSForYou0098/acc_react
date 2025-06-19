import React from 'react'
import { Button, Form } from 'react-bootstrap'

const DiscoutFIeldGroup = ({ discountType, setDiscountType, discountValue, setDiscountValue, disableChoice, handleDiscount }) => {
    return (
        <div className="border-bottom">
            <div className="input-group mb-3">
                <Form.Select
                    aria-label="Default select example"
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                >
                    <option value="fixed">Fixed</option>
                    <option value="percentage">Percentage</option>
                </Form.Select>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Add Discount"
                    aria-label="value"
                    aria-describedby="CouponCode"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                />
                <Button
                    className="btn btn-primary"
                    type="button"
                    id="CouponCode"
                    disabled={disableChoice}
                    onClick={() => handleDiscount()}
                >
                    Apply
                </Button>
            </div>
        </div>
    )
}

export default DiscoutFIeldGroup
