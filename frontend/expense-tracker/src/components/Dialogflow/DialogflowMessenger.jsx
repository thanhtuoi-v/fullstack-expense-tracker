import React, { useEffect } from 'react';

const DialogflowMessenger = () => {
  useEffect(() => {
    if (!document.querySelector('script[src*="dialogflow-console"]')) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: `
          <df-messenger
            intent="WELCOME"
            chat-title="Trợ lý chi tiêu"
            agent-id="9e0ab90b-f829-4534-8bf4-d93410e3df0f"
            language-code="vi"
          ></df-messenger>
          <style>
            df-messenger {
              position: fixed;
              bottom: 24px;
              left: 24px;
              z-index: 9999;
            }
          </style>
        `,
      }}
    />
  );
};

export default DialogflowMessenger;
