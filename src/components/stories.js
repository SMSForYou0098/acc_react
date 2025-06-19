import { Fragment, useEffect, useRef } from "react";

import { Zuck } from "zuck.js";
import "zuck.js/css";

const Stories = (props) => {
  const ref = useRef(null);
  const stateStory = props.stories;

  const timestamp = () => {
    const shifts = [
      35,
      60,
      60 * 3,
      60 * 60 * 2,
      60 * 60 * 25,
      60 * 60 * 24 * 4,
      60 * 60 * 24 * 10,
    ];

    const now = new Date().getTime();
    const shift = shifts[0] || 0;
    const date = new Date(now - shift * 1000);

    return date.getTime() / 1000;
  };

  useEffect(() => {
    if (ref.current !== null) {
      const storyArr = [];
      stateStory.forEach((item) => {
        const arr = [];
        if (item.preview !== undefined) {
          item.preview.forEach((arrItem) => {
            arr.push({
              id: arrItem.storyid,
              type: arrItem.type,
              length: arrItem.length,
              src: arrItem.src,
              preview: arrItem.storypreview,
              link: arrItem.link,
              linkText: arrItem.linkText,
              seen: arrItem.seen,
              time: timestamp(),
            });
          });
          storyArr.push({
            id: item.id,
            photo: item.photo,
            name: item.name,
            link: item.link,
            lastUpdated: timestamp(),
            items: arr,
          });
        }
      });
      Zuck(ref.current, {
        id: "stories",
        skin: "snapgram",
        autoFullScreen: true,
        avatars: true,
        stories: storyArr,
      });
    }
  }, [stateStory]);

  return (
    <Fragment>
      <div
        id="stories"
        ref={ref}
        className="storiesWrapper d-flex justify-content-around"
      ></div>
    </Fragment>
  );
};

Stories.displayName = "Stories";
export default Stories;
