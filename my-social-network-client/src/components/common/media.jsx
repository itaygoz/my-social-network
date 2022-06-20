import React, { Fragment } from "react";
import { getCurrentUser } from "../../services/authService";
import Image from "./image";

const Media = ({ title, body, sidebar, footer, avatar, images }) => {
  return (
    <Fragment>
      <div className="media">
        <Image src={avatar} alt="..."></Image>
        <div className="media-body">
          <div className="row">
            <div className="col">
              <h5 className="mt-0">{title}</h5>
              {body}
            </div>
            <div className="col-2 text-muted">{sidebar}</div>
          </div>

          <div className="row">
            {images &&
              images.map((image) => (
                <div className="col-2 pt-3" key={image.name}>
                  <Image src={image.data} alt={image.name}></Image>
                </div>
              ))}
          </div>
          {getCurrentUser() && footer}
        </div>
      </div>
    </Fragment>
  );
};

export default Media;
