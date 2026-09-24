import { Component, computed, signal } from '@angular/core';

interface ButtonConfig {
  id: string;
  label: string;
  actionType: string;
}

// Define the structure for each multiplication row
interface MultiplicationResult {
  multiplier: number;
  result: number;
}

// Define the main object structure
interface TimesTableConfig {
  Value: number;
  tableResults: MultiplicationResult[];
}

@Component({
  selector: 'app-multiplication',
  imports: [],
  templateUrl: './multiplication.html',
  styleUrl: './multiplication.css',
  standalone: true
})
export class Multiplication {

  t1 = signal<boolean>(false);
  t2 = signal<boolean>(false);
  t3 = signal<boolean>(false);
  t4 = signal<boolean>(false);
  t5 = signal<boolean>(false);
  t6 = signal<boolean>(false);
  t7 = signal<boolean>(false);
  t8 = signal<boolean>(false);
  t9 = signal<boolean>(false);
  t10 = signal<boolean>(false);
  t11 = signal<boolean>(false);

  private signalList = [
    this.t1, this.t2, this.t3, this.t4, this.t5, 
    this.t6, this.t7, this.t8, this.t9, this.t10, this.t11
  ];
   baseValue = signal<number>(0);

  buttons: ButtonConfig[] = [
    { id: 'btn-1', label: '1', actionType: '1' },
    { id: 'btn-2', label: '2', actionType: '2' },
    { id: 'btn-3', label: '3', actionType: '3' },
    { id: 'btn-4', label: '4', actionType: '4' },
    { id: 'btn-5', label: '5', actionType: '5' },
    { id: 'btn-6', label: '6', actionType: '6' },
    { id: 'btn-7', label: '7', actionType: '7' },
    { id: 'btn-8', label: '8', actionType: '8' },
    { id: 'btn-9', label: '9', actionType: '9' },
    { id: 'btn-10', label: '10', actionType: '10' },
    { id: 'btn-11', label: '11', actionType: '11' }
  ];


  handleButtonClick(action: string): void {
    console.log(`Button action triggered: ${action}`);
    // Parse the string action '1'-'11' into an integer index (0-10)
    const targetIndex = parseInt(action, 10) - 1;

    // Loop through all signals: set to true ONLY if it matches the target index
    this.signalList.forEach((sig, index) => {
      sig.set(index === targetIndex);

        this.baseValue.set(Number(action));
      
      
    });
    console.log("this.baseValue() "+this.baseValue());
   
  }

  tableData = computed<TimesTableConfig>(() => {
    const value = this.baseValue();

    return {
      Value: value,
      tableResults: Array.from({ length: 11 }, (_, i) => {
        const multiplier = i + 1;

        return {
          multiplier,
          result: value * multiplier
        };
      })
    };
  });
 
  ngOnInit(){
  
    


  }

  
}
