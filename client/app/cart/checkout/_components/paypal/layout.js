// import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

// export default function App() {
//   return (
//     <PayPalScriptProvider options={{ clientId: 'test' }}>
//       <PayPalButtons style={{ layout: 'horizontal' }} />
//     </PayPalScriptProvider>
//   );
// }
'use client';

import React, { useState, useEffect, Children } from 'react';

export default function Layout({ children }) {
  return <>{children}</>;
}
