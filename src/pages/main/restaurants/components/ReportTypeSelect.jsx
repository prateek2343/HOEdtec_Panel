import React, { useEffect, useState } from 'react'
import Select from 'react-select'

const styles = {
    multiValue: (base, state) => {
        return state.data.isFixed ? { ...base, opacity: '0.5' } : base
    },
    multiValueLabel: (base, state) => {
        return state.data.isFixed
            ? { ...base, color: '#626262', paddingRight: 6 }
            : base
    },
    multiValueRemove: (base, state) => {
        return state.data.isFixed ? { ...base, display: 'none' } : base
    },
    option: (provided, state) => ({
        ...provided,
        fontSize: '14px',
    }),
}

const ReportSelect = ({ multi, isDisabled, setReport }) => {
    // Static array of options
    const staticOptions = [
        { label: 'Payments', value: 'PAYMENTS' },
        { label: 'Orders', value: 'ORDERS' },
    ]

    const [selectedReport, setSelectedReport] = useState(null)

    // Handle select change
    const changeHandler = (selectedOption) => {
        if (selectedOption?.value) {
            setSelectedReport(selectedOption)
            setReport(selectedOption?.value)
        }
    }

    return (
        <div>
            <label className="form-label" htmlFor="mul_1">
                {multi ? 'Select Reports' : 'Select Report'}
            </label>
            <Select
                isClearable={false}
                styles={styles}
                isMulti={multi}
                name="report"
                value={selectedReport}
                onChange={changeHandler}
                options={staticOptions}
                className="react-select"
                classNamePrefix="select"
                id="mul_1"
                isDisabled={isDisabled}
            />
        </div>
    )
}

export default ReportSelect
