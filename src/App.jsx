import { useState } from 'react'
import './App.css'

function App() {
  const [hallTicket, setHallTicket] = useState('')
  const [selectedSet, setSelectedSet] = useState('')
  const [marks, setMarks] = useState('')
  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')

  // Generate dropdown options for sets (1-50)
  const setOptions = Array.from({ length: 50 }, (_, i) => i + 1)
  
  // Generate dropdown options for marks (1-75)
  const marksOptions = Array.from({ length: 75 }, (_, i) => i + 1)

  const handleHallTicketChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow digits
    if (value.length <= 8) {
      setHallTicket(value)
      if (errors.hallTicket) {
        setErrors({ ...errors, hallTicket: '' })
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    
    if (!hallTicket) {
      newErrors.hallTicket = 'Hall Ticket Number is required'
    } else if (hallTicket.length !== 8) {
      newErrors.hallTicket = 'Hall Ticket Number must be exactly 8 digits'
    }
    
    if (!selectedSet) {
      newErrors.selectedSet = 'Please select a set'
    }
    
    if (!marks) {
      newErrors.marks = 'Please select marks'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Prepare data for submission
    const formData = {
      hallTicketNumber: hallTicket,
      setNumber: selectedSet,
      marks: marks
    }

    try {
      // Send data to backend
      const response = await fetch('https://entry-be-production.up.railway.app/api/marks/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Saved Data:', data)
        setSuccessMessage('Data saved successfully!')
        
        // Reset form
        setHallTicket('')
        setSelectedSet('')
        setMarks('')
        setErrors({})
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      } else {
        setSuccessMessage('Failed to save data. Please try again.')
        setTimeout(() => {
          setSuccessMessage('')
        }, 3000)
      }
    } catch (error) {
      console.error('Error:', error)
      setSuccessMessage('Error connecting to server. Please check if backend is running.')
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }
  }

  return (
    <div className="app-container">
      <div className="form-wrapper">
        {successMessage && (
          <div className="success-message-banner">
            {successMessage}
          </div>
        )}
        <h1 className="main-heading">MARKS ENTRY</h1>
        
        <form onSubmit={handleSubmit} className="data-entry-form">
          {/* Hall Ticket Number */}
          <div className="form-group">
            <label htmlFor="hallTicket" className="form-label">
              Hall Ticket Number
            </label>
            <input
              type="text"
              id="hallTicket"
              className={`form-input ${errors.hallTicket ? 'error' : ''}`}
              value={hallTicket}
              onChange={handleHallTicketChange}
              placeholder="Enter 8 digit number"
              maxLength="8"
            />
            {errors.hallTicket && (
              <span className="error-message">{errors.hallTicket}</span>
            )}
            <span className="input-hint">{hallTicket.length}/8 digits</span>
          </div>

          {/* Set Dropdown */}
          <div className="form-group">
            <label htmlFor="set" className="form-label">
              Set
            </label>
            <input
              type="text"
              id="set"
              list="setList"
              className={`form-input ${errors.selectedSet ? 'error' : ''}`}
              value={selectedSet}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '') // Only allow digits
                if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 50)) {
                  setSelectedSet(value)
                  if (errors.selectedSet) {
                    setErrors({ ...errors, selectedSet: '' })
                  }
                }
              }}
              placeholder="Enter or select set (1-50)"
            />
            <datalist id="setList">
              {setOptions.map((num) => (
                <option key={num} value={num} />
              ))}
            </datalist>
            {errors.selectedSet && (
              <span className="error-message">{errors.selectedSet}</span>
            )}
          </div>

          {/* Marks Dropdown */}
          <div className="form-group">
            <label htmlFor="marks" className="form-label">
              Marks
            </label>
            <input
              type="text"
              id="marks"
              list="marksList"
              className={`form-input ${errors.marks ? 'error' : ''}`}
              value={marks}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '') // Only allow digits
                if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 75)) {
                  setMarks(value)
                  if (errors.marks) {
                    setErrors({ ...errors, marks: '' })
                  }
                }
              }}
              placeholder="Enter or select marks (1-75)"
            />
            <datalist id="marksList">
              {marksOptions.map((num) => (
                <option key={num} value={num} />
              ))}
            </datalist>
            {errors.marks && (
              <span className="error-message">{errors.marks}</span>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
