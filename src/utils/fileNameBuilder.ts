import path from "path";
import { v1 as uuidV1 } from "uuid";

export const fileNameBuilder = (
  extension: string,
  itemType: string,
  itemId: string
): string => path.join(itemType, itemId, `${uuidV1()}.${extension}`);
