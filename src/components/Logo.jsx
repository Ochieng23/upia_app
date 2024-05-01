import Image from "next/image";
import logo from "../images/images/UPIALogo-01.svg"

export function Logo(props) {
  return (
    <Image src={logo} alt="Logo" width={150} height={150} />
  )
}
