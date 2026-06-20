import Image from "next/image";
import logo from "../images/images/UPIALogo-01.svg"

export function Logo({ className, ...props }) {
  return (
    <Image src={logo} alt="Logo" width={200} height={200} className={className} {...props} />
  )
}
