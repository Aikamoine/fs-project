import React from 'react'

const StepsView = ({ steps }) => (
  <div>
    <h3>Työvaiheet</h3>
    <div>
      {steps.map((step) => (
        <div key={step.id}>
          {step.number}
          {'. '}
          {step.step}
        </div>
      ))}
    </div>
  </div>
)

export default StepsView
