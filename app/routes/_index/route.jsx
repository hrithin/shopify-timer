import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import CountdownTimers from "../CountdownTimers";



export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export default function IndexRoute() {
  return (
    
      <CountdownTimers />
   
  );
}
