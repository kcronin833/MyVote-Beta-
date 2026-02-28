import type React from "react"

interface RepresentativeProfileProps {
  name: string
  district: string
  party: string
  officeLocations: string[]
  contactInformation: {
    phone: string
    address: string
    email?: string
  }
  bio?: string
  committees?: string[]
}

export const RepresentativeProfile: React.FC<RepresentativeProfileProps> = ({
  name,
  district,
  party,
  officeLocations,
  contactInformation,
  bio,
  committees,
}) => {
  return (
    <div className="representative-profile">
      <h2>{name}</h2>
      <p>
        <strong>District:</strong> {district} (Atlanta/Georgia)
      </p>
      <p>
        <strong>Party:</strong> {party}
      </p>
      <h3>Office Locations</h3>
      <ul>
        {officeLocations.map((location, index) => (
          <li key={index}>{location}</li>
        ))}
      </ul>
      <h3>Contact Information</h3>
      <p>
        <strong>Phone:</strong> {contactInformation.phone}
      </p>
      <p>
        <strong>Address:</strong> {contactInformation.address}
      </p>
      {contactInformation.email && (
        <p>
          <strong>Email:</strong> {contactInformation.email}
        </p>
      )}
      {bio && (
        <>
          <h3>Biography</h3>
          <p>{bio}</p>
        </>
      )}
      {committees && (
        <>
          <h3>Committees</h3>
          <ul>
            {committees.map((committee, index) => (
              <li key={index}>{committee}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default RepresentativeProfile
