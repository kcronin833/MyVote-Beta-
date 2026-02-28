import type React from "react"

interface Representative {
  name: string
  district?: string
  party: string
  officeLocations?: string[]
  contactInformation?: {
    phone: string
    address: string
    email?: string
  }
  bio?: string
  committees?: string[]
}

interface RepresentativeProfileProps {
  representative: Representative
}

export const RepresentativeProfile: React.FC<RepresentativeProfileProps> = ({
  representative,
}) => {
  const { name, district, party, officeLocations, contactInformation, bio, committees } = representative || {}

  return (
    <div className="representative-profile">
      <h2>{name}</h2>
      {district && (
        <p>
          <strong>District:</strong> {district} (Atlanta/Georgia)
        </p>
      )}
      <p>
        <strong>Party:</strong> {party}
      </p>
      {officeLocations && officeLocations.length > 0 && (
        <>
          <h3>Office Locations</h3>
          <ul>
            {officeLocations.map((location, index) => (
              <li key={index}>{location}</li>
            ))}
          </ul>
        </>
      )}
      {contactInformation && (
        <>
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
        </>
      )}
      {bio && (
        <>
          <h3>Biography</h3>
          <p>{bio}</p>
        </>
      )}
      {committees && committees.length > 0 && (
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
