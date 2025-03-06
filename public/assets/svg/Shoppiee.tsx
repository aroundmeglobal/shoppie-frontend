import * as React from "react";

const Shoppiee: React.FC<React.SVGProps<SVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="50"
    fill="none"
    viewBox="0 0 100 100"
  >
    <circle cx="50" cy="50" r="50" fill="#09090B"></circle>
    <g filter="url(#filter0_d_13510_5398)">
      <mask
        id="path-2-outside-1_13510_5398"
        width="47"
        height="48"
        x="26"
        y="25"
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <path fill="#fff" d="M26 25h47v48H26z"></path>
        <path d="M55.64 40.94q.18-.9.18-2.46 0-.9-.12-1.74-.12-.9-.42-1.56-.3-.72-.9-1.08-.6-.42-1.56-.42-1.08 0-1.98.48t-1.62 1.26q-.66.72-1.08 1.74-.36.96-.36 2.04 0 1.56.78 2.4.84.84 2.16 1.38t3 .9 3.48.84q1.5.42 3 1.08t2.64 1.8q1.2 1.08 1.92 2.88.72 1.74.72 4.38 0 3.78-1.5 6.36t-4.14 4.2-6.3 2.34q-3.6.72-7.86.72-4.32 0-7.08-.54-2.7-.6-4.26-1.26-1.86-.78-2.76-1.8l2.04-8.22h10.56q-.06.54-.12 1.5-.06.9-.06 1.44 0 .72.18 1.5t.54 1.44q.42.66 1.14 1.08t1.8.42q1.2 0 2.1-.54.96-.54 1.56-1.32.66-.84.96-1.8.36-1.02.36-1.98 0-1.32-.66-2.22-.6-.9-1.68-1.5-1.08-.66-2.52-1.08-1.38-.48-2.88-.96-1.44-.42-3.06-1.02-1.56-.6-2.88-1.68t-2.22-2.7q-.84-1.68-.84-4.26 0-3.84 1.92-6.42 1.98-2.64 4.92-4.26 3-1.62 6.54-2.28 3.54-.72 6.72-.72 4.2 0 7.2 1.02 3.06.96 4.62 2.28l-2.22 8.34z"></path>
      </mask>
      <path
        fill="#fff"
        d="M55.64 40.94q.18-.9.18-2.46 0-.9-.12-1.74-.12-.9-.42-1.56-.3-.72-.9-1.08-.6-.42-1.56-.42-1.08 0-1.98.48t-1.62 1.26q-.66.72-1.08 1.74-.36.96-.36 2.04 0 1.56.78 2.4.84.84 2.16 1.38t3 .9 3.48.84q1.5.42 3 1.08t2.64 1.8q1.2 1.08 1.92 2.88.72 1.74.72 4.38 0 3.78-1.5 6.36t-4.14 4.2-6.3 2.34q-3.6.72-7.86.72-4.32 0-7.08-.54-2.7-.6-4.26-1.26-1.86-.78-2.76-1.8l2.04-8.22h10.56q-.06.54-.12 1.5-.06.9-.06 1.44 0 .72.18 1.5t.54 1.44q.42.66 1.14 1.08t1.8.42q1.2 0 2.1-.54.96-.54 1.56-1.32.66-.84.96-1.8.36-1.02.36-1.98 0-1.32-.66-2.22-.6-.9-1.68-1.5-1.08-.66-2.52-1.08-1.38-.48-2.88-.96-1.44-.42-3.06-1.02-1.56-.6-2.88-1.68t-2.22-2.7q-.84-1.68-.84-4.26 0-3.84 1.92-6.42 1.98-2.64 4.92-4.26 3-1.62 6.54-2.28 3.54-.72 6.72-.72 4.2 0 7.2 1.02 3.06.96 4.62 2.28l-2.22 8.34z"
      ></path>
      <path
        fill="#353535"
        d="m55.64 40.94-4.194-.839-1.023 5.116h5.217zm.06-4.2-4.24.565.003.02.003.02zm-.42-1.56-3.948 1.645.026.063.028.062zm-.9-1.08-2.453 3.504.123.086.13.078zm-3.54.06 2.013 3.774zm-1.62 1.26-3.143-2.901-.005.006-.005.005zm-1.08 1.74-3.955-1.628-.026.063-.024.063zm.42 4.44-3.134 2.91.054.058.056.056zm2.16 1.38-1.62 3.959zm3 .9-.896 4.182zm3.48.84 1.153-4.119-.025-.007-.026-.007zm3 1.08-1.723 3.915zm2.64 1.8-3.024 3.024.08.08.083.075zm1.92 2.88-3.971 1.588.01.024.009.023zm-.78 10.74 3.697 2.15zm-4.14 4.2-2.237-3.645zm-6.3 2.34-.826-4.197-.013.003zm-14.94.18-.928 4.175.053.012.054.01zm-4.26-1.26 1.666-3.939-.012-.005zm-2.76-1.8-4.151-1.03-.54 2.177 1.484 1.683zm2.04-8.22v-4.277h-3.345l-.806 3.247zm10.56 0 4.25.472.529-4.749H44.18zm-.12 1.5 4.267.285.001-.01v-.008zm.12 2.94-4.167.962zm.54 1.44-3.755 2.048.07.127.077.121zm1.14 1.08-2.155 3.694zm3.9-.12-2.097-3.728-.052.03-.051.03zm1.56-1.32-3.363-2.642-.014.017-.013.017zm.96-1.8-4.033-1.424-.026.074-.023.074zm-.3-4.2-3.559 2.372.053.08.057.077zm-1.68-1.5-2.23 3.65.075.046.078.043zm-2.52-1.08-1.405 4.04.103.035.104.03zm-2.88-.96 1.303-4.074-.052-.016-.053-.016zm-3.06-1.02-1.535 3.992.025.01.025.009zm-2.88-1.68 2.708-3.31zm-2.22-2.7-3.826 1.913.042.083.045.081zm1.08-10.68-3.422-2.566-.004.006-.005.007zm4.92-4.26-2.032-3.763-.016.008-.016.009zm6.54-2.28.784 4.204.034-.006.034-.007zm13.92.3-1.377 4.05.048.016.049.015zm4.62 2.28 4.133 1.1.697-2.616-2.067-1.749zm-2.22 8.34v4.277h3.287l.846-3.177zm-5.766.839c.2-1.002.263-2.143.263-3.299h-8.554c0 .924-.057 1.423-.097 1.621zm.263-3.299q.001-1.186-.163-2.345l-8.468 1.21q.076.521.077 1.135zm-.157-2.305c-.123-.916-.355-1.86-.766-2.765l-7.788 3.54c-.01-.025.037.072.075.355zm-.712-2.64c-.51-1.222-1.375-2.339-2.648-3.102l-4.4 7.334a2.2 2.2 0 0 1-.56-.479 1.9 1.9 0 0 1-.288-.463zm-2.395-2.939c-1.313-.919-2.766-1.193-4.013-1.193v8.554c.033 0-.38.005-.893-.353zm-4.013-1.193c-1.38 0-2.737.313-3.993.983l4.026 7.548a.3.3 0 0 1-.06.023l-.01.002q.006-.001.037-.002zm-3.993.983a10.4 10.4 0 0 0-2.75 2.133l6.286 5.802c.168-.182.33-.302.49-.387zm-2.76 2.144a10.1 10.1 0 0 0-1.882 3.002l7.91 3.257c.113-.276.218-.414.278-.479zm-1.932 3.128a10 10 0 0 0-.632 3.542h8.554c0-.235.037-.404.088-.538zm-.632 3.542c0 1.724.438 3.71 1.923 5.31l6.268-5.82c.204.22.306.437.349.568.037.114.014.115.014-.058zm2.033 5.424c1.033 1.034 2.262 1.782 3.565 2.315l3.238-7.918c-.457-.187-.668-.359-.755-.445zM49.1 46.94c1.155.472 2.404.84 3.723 1.123l1.792-8.364c-.92-.197-1.672-.43-2.277-.677zm3.723 1.123q1.568.336 3.274.79l2.204-8.265a77 77 0 0 0-3.686-.89zm3.223.777q1.194.332 2.43.876l3.446-7.83a27 27 0 0 0-3.57-1.284zm2.43.876c.523.23.96.53 1.339.91l6.048-6.05a12.9 12.9 0 0 0-3.942-2.69zm1.502 1.064c.225.202.525.577.81 1.29l7.942-3.177c-.675-1.688-1.655-3.234-3.03-4.471zm.829 1.336c.198.478.395 1.337.395 2.745h8.554c0-2.112-.283-4.173-1.045-6.015zm.395 2.745c0 1.963-.389 3.295-.92 4.21l7.394 4.3c1.469-2.525 2.08-5.433 2.08-8.51zm-.92 4.21c-.631 1.085-1.5 1.98-2.68 2.705l4.474 7.29c2.34-1.435 4.231-3.34 5.6-5.695zm-2.68 2.705c-1.248.765-2.849 1.387-4.889 1.788l1.652 8.394c2.84-.56 5.438-1.497 7.71-2.892zm-4.902 1.791c-2.084.417-4.419.637-7.021.637v8.554c3.078 0 5.983-.26 8.699-.803zm-7.021.637c-2.734 0-4.792-.174-6.259-.46l-1.642 8.394c2.213.433 4.875.62 7.901.62zm-6.152-.438c-1.684-.374-2.822-.728-3.521-1.024l-3.334 7.878c1.38.584 3.083 1.07 5 1.496zm-3.534-1.03a6 6 0 0 1-.938-.477c-.202-.133-.27-.21-.269-.208l-6.414 5.66c1.182 1.34 2.741 2.255 4.313 2.914zm-.263 3.175 2.04-8.22-8.302-2.06-2.04 8.22zm-2.111-4.973h10.56v-8.554H33.62zm6.31-4.75c-.052.462-.097 1.041-.139 1.706l8.538.534c.038-.615.073-1.036.102-1.295zm-.138 1.689c-.042.64-.069 1.227-.069 1.724h8.554c0-.223.013-.597.05-1.156zm-.069 1.724c0 .837.105 1.66.29 2.462l8.334-1.924a2.4 2.4 0 0 1-.07-.538zm.29 2.462c.201.874.514 1.723.952 2.526l7.51-4.096a1.4 1.4 0 0 1-.128-.354zm1.099 2.774a7.56 7.56 0 0 0 2.593 2.478l4.31-7.388c.027.015.079.05.142.11q.096.09.171.208zm2.593 2.478c1.3.759 2.697 1.003 3.955 1.003v-8.554c-.181 0 .015-.036.355.163zm3.955 1.003c1.462 0 2.945-.336 4.3-1.15l-4.4-7.334a.7.7 0 0 1 .16-.07c.033-.009.019 0-.06 0zm4.197-1.09a9.3 9.3 0 0 0 2.853-2.44l-6.78-5.215c-.01.012-.069.089-.267.2zm2.826-2.405a9.9 9.9 0 0 0 1.68-3.166l-8.165-2.552a1.3 1.3 0 0 1-.241.434zm1.63-3.019c.381-1.08.604-2.22.604-3.403h-8.554c0 .098-.017.276-.116.556zm.604-3.403c0-1.618-.417-3.289-1.488-4.75l-6.898 5.06a1 1 0 0 1-.156-.306c-.022-.077-.012-.088-.012-.004zm-1.378-4.592c-.829-1.243-1.931-2.183-3.162-2.867l-4.154 7.478c.11.06.166.106.188.126.021.019.02.021.01.007zM52.53 51.03c-1.095-.67-2.294-1.17-3.552-1.537l-2.396 8.212c.663.193 1.143.413 1.488.624zm-3.345-1.47q-1.434-.499-2.982-.995l-2.607 8.148q1.454.465 2.779.926zm-3.087-1.027a41 41 0 0 1-2.773-.925l-2.97 8.022a50 50 0 0 0 3.347 1.115zm-2.723-.906a6.2 6.2 0 0 1-1.707-.998l-5.416 6.62a14.7 14.7 0 0 0 4.053 2.362zm-1.707-.998c-.426-.35-.829-.818-1.19-1.467l-7.477 4.154c.84 1.511 1.917 2.842 3.25 3.933zm-1.102-1.303c-.174-.347-.389-1.056-.389-2.347h-8.554c0 2.15.345 4.28 1.291 6.173zm-.389-2.347c0-1.824.444-3.02 1.074-3.867l-6.862-5.106c-1.93 2.593-2.766 5.677-2.766 8.973zm1.065-3.854a11 11 0 0 1 3.562-3.08l-4.128-7.492a19.6 19.6 0 0 0-6.278 5.44zm3.53-3.063c1.588-.857 3.344-1.475 5.292-1.839l-1.568-8.408c-2.772.516-5.376 1.418-7.788 2.72zm5.36-1.852c2.117-.43 4.07-.634 5.868-.634v-8.554c-2.442 0-4.969.276-7.572.806zM56 33.577c2.475 0 4.384.303 5.823.792l2.754-8.098c-2.561-.871-5.452-1.248-8.577-1.248zm5.92.824c1.772.556 2.709 1.101 3.137 1.464l5.526-6.53c-1.652-1.397-3.795-2.372-6.103-3.096zm1.767-2.901-2.22 8.34 8.266 2.2 2.22-8.34zm1.913 5.163h-9.96v8.554h9.96z"
        mask="url(#path-2-outside-1_13510_5398)"
      ></path>
    </g>
    <defs>
      <filter
        id="filter0_d_13510_5398"
        width="45.758"
        height="58.427"
        x="26.891"
        y="25.023"
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix"></feFlood>
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        ></feColorMatrix>
        <feOffset dy="10.693"></feOffset>
        <feComposite in2="hardAlpha" operator="out"></feComposite>
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"></feColorMatrix>
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_13510_5398"
        ></feBlend>
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_13510_5398"
          result="shape"
        ></feBlend>
      </filter>
    </defs>
  </svg>
);

export default Shoppiee;
