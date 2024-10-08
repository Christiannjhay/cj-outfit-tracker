import * as React from "react"
import Svg, { Path } from "react-native-svg"
const ClosetIcon = (props : any) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="#1C274C"
      fillRule="evenodd"
      d="M11.25 2H10C6.229 2 4.343 2 3.172 3.172 2 4.343 2 6.229 2 10v2c0 3.771 0 5.657 1.172 6.828a3.1 3.1 0 0 0 1.078.697V22a.75.75 0 0 0 1.5 0v-2.129C6.82 20 8.194 20 10 20h1.25V2ZM9 8.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V9A.75.75 0 0 1 9 8.25ZM12.75 20H14c1.806 0 3.18 0 4.25-.129V22a.75.75 0 0 0 1.5 0v-2.475a3.1 3.1 0 0 0 1.078-.697C22 17.657 22 15.771 22 12v-2c0-3.771 0-5.657-1.172-6.828C19.657 2 17.771 2 14 2h-1.25v18ZM15 8.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default ClosetIcon
