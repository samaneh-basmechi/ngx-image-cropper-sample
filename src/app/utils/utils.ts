export class Utils {

  //#region : Unique Id
  static uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static dateString() {
    const currentdate = new Date();
    const datetime =
      String(currentdate.getFullYear()) +
      String(currentdate.getMonth() + 1) +
      String(currentdate.getDate()) +
      '-' +
      String(currentdate.getHours()) +
      String(currentdate.getMinutes()) +
      String(currentdate.getSeconds());
    return datetime;
  }

  //#endregion

}
