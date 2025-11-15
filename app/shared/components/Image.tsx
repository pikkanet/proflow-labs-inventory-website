"use client";

import { Image as AntdImage, ImageProps } from "antd";

const DEFAULT_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E";

const Image = (props: ImageProps) => {
  return <AntdImage {...props} fallback={props.fallback || DEFAULT_FALLBACK} />;
};

export default Image;
