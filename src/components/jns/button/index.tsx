/* eslint-disable react/destructuring-assignment */
import { Button } from '@ensdomains/thorin'

export default function JNSGradientButton(props: typeof Button.defaultProps) {
  return (
    <Button
      {...props}
      style={{
        ...props?.style,
        background: 'linear-gradient(45deg, #3C32BB 0%, #5536AE 100%)',
      }}
    >
      {props?.children}
    </Button>
  )
}
