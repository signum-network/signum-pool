import { additionalLinks } from "../../enviroments";

export const extraLinks =
    additionalLinks && additionalLinks.links
        ? additionalLinks?.links.filter((item: any) => {
              if (
                  item.label &&
                  item.label &&
                  (item.newTab || item.newTab === false)
              )
                  return true;
              return false;
          })
        : [];
