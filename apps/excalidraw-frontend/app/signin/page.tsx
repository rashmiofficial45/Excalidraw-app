import React from 'react'
import Auth from '../../components/auth/Auth'

type Props = {}

const SignInPage = (props: Props) => {
  return (
    <div>
          <Auth isSignupPage={false}/>
    </div>
  )
}
export default SignInPage