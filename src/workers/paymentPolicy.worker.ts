import { paymentPolicy } from '../services/paymentPolicy/engine'
import type { PolicyInput } from '../services/paymentPolicy/types'
self.onmessage = ({ data }: MessageEvent<{ id: number; input: PolicyInput }>) => {
  try {
    self.postMessage({ id: data.id, result: paymentPolicy(data.input) })
  } catch {
    self.postMessage({
      id: data.id,
      result: {
        status: 'unsupported',
        model: 'payment-policy-v2',
        code: 'invalid-input',
        reason: 'The policy calculation could not complete; no probability is available',
      },
    })
  }
}
