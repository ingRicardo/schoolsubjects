import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common';

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

interface Reward {
  id: number;
  name: string;
  img: string;
}

export type TabType = 'multiplication' | 'addition' | 'subtraction';

@Component({
  selector: 'app-multiplication',
  imports: [FormsModule, CommonModule],
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

  basetable = signal<number | undefined>(undefined);
  ranmulti = signal<number | undefined>(undefined);
  ranresult = signal<number | undefined>(undefined);
  inputres = signal<number>(0);

  hasRewards = signal<boolean>(false);
  isRewardAlertOpen = signal<boolean>(false);
  // Modal visibility state
  isOpen = signal<boolean>(true);

  // Temporary input binding
  enteredName = signal<string>('');

  // Submitted name state
  userName = signal<string | null>(null);


  activeTab = signal<TabType>('multiplication');

  selectTab(tab: TabType): void {
    this.activeTab.set(tab);
  }


  // Signal holding an empty array typed with interface
  rewards = signal<Reward[]>([]);

  closeReward() {
    this.isRewardAlertOpen.set(false);
    this.count.set(0);
  }

  selectedValue = signal<string>('');


  pickRandom(): void {
    const list = this.images();
    if (list.length === 0) return;

    const randomIndex = Math.floor(Math.random() * list.length);
    this.selectedValue.set(list[randomIndex]);
  }


  // Method to add items to the array
  addItem(newItem: Reward) {
    this.rewards.update(currentItems => [...currentItems, newItem]);
  }

  // Method to clear the array
  clearItems() {
    this.rewards.set([]);
  }


  openPrompt() {
    this.enteredName.set('');
    this.isOpen.set(true);
  }

  closePrompt() {
    this.isOpen.set(false);
  }

  submitName() {
    if (this.enteredName().trim()) {
      this.userName.set(this.enteredName().trim());
      this.closePrompt();
    }
  }

  handleButtonClick(action: string): void {
    console.log(`Button action triggered: ${action}`);
    // Parse the string action '1'-'11' into an integer index (0-10)
    const targetIndex = parseInt(action, 10) - 1;

    // Loop through all signals: set to true ONLY if it matches the target index
    this.signalList.forEach((sig, index) => {
      sig.set(index === targetIndex);

      this.baseValue.set(Number(action));

    });
    console.log("this.baseValue() " + this.baseValue());

    this.genRandTable();
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

  count = signal<number>(0);
  displaycount = signal<number>(0);
  increment(): void {
    this.count.update(val => val + 1);
    this.displaycount.update(val => val + 1);
  }

  decrement(): void {
    this.count.update(val => val - 1);
    this.displaycount.update(val => val - 1);
  }

  genRandTable() {

    console.log("genRandTable");
    const results = this.tableData().tableResults;
    const randomIndex = Math.floor(Math.random() * results.length);
    const randomRow = results[randomIndex];

    console.log('Random Row:', randomRow);
    console.log(this.baseValue(), randomRow.multiplier, randomRow.result);

    this.basetable.set(this.baseValue());
    this.ranmulti.set(randomRow.multiplier);
    this.ranresult.set(randomRow.result);

    console.log(this.inputres());

  }

  // Method to set a random integer from 1 to 11
  generateRandomBaseValue(): void {
    const randomNumber = Math.floor(Math.random() * 11) + 1;
    this.baseValue.set(randomNumber);
  }

  answerStatus = signal<'correct' | 'wrong' | null>(null);

  isResOk() {
    if (this.inputres() == this.ranresult()) {
      this.answerStatus.set('correct');
      this.increment();
    } else {
      this.answerStatus.set('wrong');
      this.decrement();

    }
    this.inputres.set(0);
    console.log("count : ", this.count());

    this.calculatePoints();

    this.generateRandomBaseValue();
    this.genRandTable();

    setTimeout(() => this.answerStatus.set(null), 4000);
  }

  // Signal to store accumulated points
  rewardAmount = signal<number>(0);
  currentRewardPoints = 0;

  images = signal<string[]>([
    'https://cdn-icons-png.flaticon.com/512/1998/1998713.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInvIFwj0-Mj8XEQKrPwNfWdXv0-St-SaS4vzlsuU1bxs1511RBOVVCEU&s=10',
    'https://www.freeiconspng.com/thumbs/animal-icon-png/penguin-animal-icon-png-21.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuueu5UbyMFtInm-5QN7R6aKTX1NgLOOtwTWpABKePYw&s=10',
    'https://cdn-icons-png.flaticon.com/512/616/616408.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTmt9AUoQxfkz4Nsq_g-gHQeanuvrePE_y_78sZ5gT1w&s=10',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDvhVrKS2j_9K2qzIIcEy0rqrx0KZeKLZk3gcHGn9MhQ&s=10',
    'https://png.pngtree.com/png-clipart/20240629/original/pngtree-cute-little-brown-and-white-dog-icon-icon-vector-png-image_15442724.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZgqlxhd62L0_Ls7vXqk9iatzjg5o8cUH1OSihxiatxA&s=10',
    'https://png.pngtree.com/png-vector/20230922/ourmid/pngtree-dinosaur-cartoon-clip-art-png-image_10145425.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBsZWRhIpAsHpS6g9F6tLqbB_l6Hkjw8ML55z66XM3WzfqFhCdvBWRMQs&s=10',
    'https://png.pngtree.com/png-clipart/20240117/original/pngtree-3d-icon-animal-gradient-ui-material-bird-bird-ux-design-png-image_14129051.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/cute-elephant-3d-icon-png-download-9169101.png',
    'https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-o9Z7xSaIdzX5ofAaxTC5PGgbEn0cFv.png&w=1000&q=75',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUUiPyE5FYFQBgsDCDEZnencs-qYEZptY3h4m__Vi6HA&s=10',
    'https://media.istockphoto.com/id/1972019005/vector/cute-fun-cartoon-owl-character-detailed-icon-realistic-animal-shape-with-big-eyes-beak-and.jpg?s=612x612&w=0&k=20&c=4Evti3Ed5Cp_b869C-QGNoWuTSGC2xLtArvcgABgWFA=',
    'https://static.vecteezy.com/system/resources/previews/046/498/611/non_2x/turtle-animal-3d-design-free-png.png',
    'https://cdn3d.iconscout.com/3d/premium/thumb/bear-3d-icon-png-download-3972343.png',
    'https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-v4zUBw3nzVDWzDbHREpjooTeaVFGXW.png&w=1000&q=75',
    'https://img.magnific.com/free-psd/3d-rendering-spring-icon_23-2151115352.jpg?semt=ais_hybrid&w=740&q=80',
    'https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-5EQh5xJU8GYvfgVcULbg6qI2fkZAqf.png&w=1000&q=75',
    'https://cdn3d.iconscout.com/3d/premium/thumb/charming-rhinoceros-figurine-3d-icon-png-download-10077241.png',
    'https://img.magnific.com/premium-photo/3d-cartoon-capybara-isolated_1021802-48054.jpg?semt=ais_hybrid&w=740&q=80'

  ]);


  // Method executing loop from 10 to 1000 stepping by 10
  calculatePoints(): void {

    for (let i = 10; i <= 1000; i += 10) {
      if (i === this.count()) {
        this.currentRewardPoints += 1; // Increment point on match
        this.hasRewards.set(true);
        this.isRewardAlertOpen.set(true);

        this.pickRandom();
        
        const newReward: Reward = {
          id: Date.now(), // Unique ID using timestamp
          name: 'Gold Trophy',
          img: this.selectedValue()
        };
        
        console.log("selectedValue ", this.selectedValue())
        this.addItem(newReward);

      }

    }
    /*
    if (10 === this.count()) {
      this.currentRewardPoints += 1; // Increment point on match
      this.hasRewards.set(true);
      this.isRewardAlertOpen.set(true);
    }
    */
    console.log("currentRewardPoints ", this.currentRewardPoints);
    // Update the reactive signal
    this.rewardAmount.set(this.currentRewardPoints);

  }

  ngOnInit() {

  }
  ngOnChanges() {


  }
}
