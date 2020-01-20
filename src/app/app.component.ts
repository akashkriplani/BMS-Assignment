import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BMS-Assignment';
  value: string;
  addToList = [];
  duplicateNumbers = [];

  /**
   * @public
   * @param value
   * @memberof AppComponent
   */

  public handleUserInput(value: string): void {
    this.addToSessionStorage(value);
  }


  /**
   * @private
   * @param list
   * @param item
   * @memberof AppComponent
   * @returns boolean
   */
  private isNotDuplicate(list, item): boolean {
    return list.some(i => {
      return i.toString() === item.trim();
    });
  }


  /**
   * @private
   * @param value
   * @memberof AppComponent
   */

  private addToSessionStorage(value: string): void {
    this.addToList = [];
    this.duplicateNumbers = [];
    if (sessionStorage.getItem('values')) {
      this.addToList = JSON.parse(sessionStorage.getItem('values'));
    } else {
      this.addToList = [];
    }
    const userInput = value.split(',');
    if (userInput && userInput.length > 0) {
      userInput.forEach((item) => {
        if (item && item.indexOf('-') === -1 && !this.isNotDuplicate(this.addToList, item)) {
          this.addToList.push(parseInt(item.trim()));
        } else if (item && item.indexOf('-') === -1 && this.isNotDuplicate(this.addToList, item)) {
          this.duplicateNumbers.push(parseInt(item.trim()));
        }
      });
      const range = userInput.filter((item) => {
        return item.trim().indexOf('-') > -1;
      });
      if (range && range.length > 0) {
        this.addRangeNumbers(range);
      }
    }
    if (this.addToList && this.addToList.length > 0) {
      this.addToList.sort((a, b) => {
        return a - b;
      });
    }
    sessionStorage.setItem('values', JSON.stringify(this.addToList));
  }

  /**
   * @private
   * @param rangeArray
   * @memberof AppComponent
   */
  private addRangeNumbers(rangeArray): void {
    for(let range = 0; range < rangeArray.length; range++) {
      const splitRange = rangeArray[range].trim().split('-');
      if (splitRange && splitRange.length === 2) {
        if (parseInt(splitRange[0]) < parseInt(splitRange[1])) {
          for(let i = parseInt(splitRange[0]); i <= parseInt(splitRange[1]); i++) {
            // TODO: Handle notification messages
            if (!this.isNotDuplicate(this.addToList, i.toString())) {
              this.addToList.push(i);
            } else if (this.isNotDuplicate(this.addToList, i.toString())) {
              this.duplicateNumbers.push(i);
            }
          }
        }
      }
    }
  }
}
