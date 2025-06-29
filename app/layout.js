import '../styles/globals.css'
import CustomCursor from '@/components/CustomCursor'

export const metadata = {
  title: 'LuminaOS',
  description: 'Next generation operating system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="darkreader-lock" content="true" />
        <script dangerouslySetInnerHTML={{
          __html: `
            // Disable Dark Reader
            if (typeof window !== 'undefined') {
              // Remove Dark Reader styles
              const darkReaderStyles = document.querySelectorAll('style[class*="darkreader"]');
              darkReaderStyles.forEach(style => style.remove());
              
              // Override any Dark Reader modifications
              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                      if (node.nodeType === 1 && node.tagName === 'STYLE' && 
                          node.className && node.className.includes('darkreader')) {
                        node.remove();
                      }
                    });
                  }
                });
              });
              
              observer.observe(document.head, { childList: true });
            }
          `
        }} />
      </head>
      <body>
        {children}
        <CustomCursor />
      </body>
    </html>
  )
} 