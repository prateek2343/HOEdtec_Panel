import React from 'react'
import Navbar from './navbar'

function Index() {
  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-16 p-6">
        <h1 className="text-3xl font-semibold text-center mb-6">Offline Media, Inc. Data Privacy Agreement</h1>

        <p className="mb-4 text-lg">
          This Data Privacy Agreement ("Agreement") is made and entered into by and between Offline Media Inc., with its principal place of business at 421 N Harrington Street Raleigh, NC ("Offline Media"), and the business or individual accepting this Agreement (this business or individual being you).
        </p>

        <h2 className="text-2xl font-bold mb-2">1. Purpose of Data Usage</h2>
        <p className="mb-4 text-lg">
          Offline Media will access and use the data provided by the Restaurant Partner solely for the purpose of establishing a data connection through the Restaurant Partner's Point of Sale System (POS), and generating an internal report to update the Restaurant Partner's dashboard ("Purpose"). Offline Media agrees not to use the data for any other purpose without the Restaurant Partner’s prior written consent.
        </p>

        <h2 className="text-2xl font-bold mb-2">2. Connection to Offer Partnership</h2>
        <p className="mb-4 text-lg">
          This Agreement is made in connection with the existing partnership between the Restaurant Partner and Offline Media, referred to as the “Offer Partnership”. Any termination of the Offer Partnership shall automatically result in the termination of this Data Privacy Agreement.
        </p>

        <h2 className="text-2xl font-bold mb-2">3. Restriction on Data Sharing</h2>
        <p className="mb-4 text-lg">
          Offline Media agrees that all data received from the Restaurant Partner under this Agreement shall be kept strictly confidential and shall not be sold, shared, or disclosed to any third parties, including other restaurants or vendors, without prior written consent from the Restaurant Partner, except as required by law.
        </p>

        <h2 className="text-2xl font-bold mb-2">4. Prohibition on Data Sale and Distribution</h2>
        <p className="mb-4 text-lg">
          Offline Media will not sell, license, or otherwise distribute the data obtained from the Restaurant Partner to any other person, entity, or organization.
        </p>

        <h2 className="text-2xl font-bold mb-2">5. Data Security and Storage</h2>
        <p className="mb-4 text-lg">
          Offline Media will store all data received from the Restaurant Partner in a secure and password-protected environment. Offline Media agrees to implement and maintain reasonable security measures to protect the data against unauthorized access, theft, or disclosure.
        </p>

        <h2 className="text-2xl font-bold mb-2">6. Data Breach Notification</h2>
        <p className="mb-4 text-lg">
          In the event of a data breach or unauthorized access to the Restaurant Partner’s data, Offline Media will notify the Restaurant Partner immediately upon discovery of the breach and will take all reasonable steps to mitigate any potential damages.
        </p>

        <h2 className="text-2xl font-bold mb-2">7. Indemnification</h2>
        <p className="mb-4 text-lg">
          Offline Media agrees to indemnify and hold the Restaurant Partner harmless against any losses, damages, or claims arising from Offline Media’s negligence or misconduct in handling the data provided under this Agreement.
        </p>

        <h2 className="text-2xl font-bold mb-2">8. Termination and Data Destruction</h2>
        <p className="mb-4 text-lg">
          Upon termination of this Agreement or completion of the Purpose, Offline Media agrees to securely delete or destroy all data obtained from the Restaurant Partner within 30 days, unless otherwise required by law. Offline Media will provide the Restaurant Partner with written certification confirming that all data, including any backups, has been deleted from their systems.
        </p>

        <h2 className="text-2xl font-bold mb-2">9. Compliance with Applicable Laws</h2>
        <p className="mb-4 text-lg">
          Both parties agree to comply with all applicable data protection and privacy laws and regulations in relation to the handling, processing, and storing of data under this Agreement.
        </p>

        <h2 className="text-2xl font-bold mb-2">10. Entire Agreement</h2>
        <p className="mb-4 text-lg">
          This Agreement constitutes the entire understanding between the parties regarding the subject matter hereof and supersedes any prior agreements, representations, or understandings.
        </p>

        <h2 className="text-2xl font-bold mb-2">11. Governing Law</h2>
        <p className="mb-4 text-lg">
          This Agreement shall be governed by and construed in accordance with the laws of the state of North Carolina.
        </p>
      </div>
    </>
  )
}

export default Index
