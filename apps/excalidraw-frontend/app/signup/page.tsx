import React from 'react'
import Auth from '../../components/auth/Auth'

type Props = {}

const SignUpPage = (props: Props) => {
    return (
        <div>
            <Auth isSignupPage={true} />
        </div>
    )
}
export default SignUpPage