export class Store {
  prevState = {};
  state = {};
  subscribers = [];
  reducer;

  constructor(reducer) {
    this.reducer = reducer;
  }

  // 자신을 구독하는 컴포넌트를 등록하는 메서드
  registerSubscriber(subscriber, subscribingStates) {
    this.subscribers.push({ subscriber, subscribingStates });
  }

  removeDestroyedSubscribers(destoryedSubscribers) {
    const newSubscribers = this.subscribers.filter((subscriber) => {
      return !destoryedSubscribers.some((destoryedSubscriber) => {
        return Object.is(destoryedSubscriber, subscriber);
      });
    });

    this.subscribers = newSubscribers;
  }

  // action을 받아 상태변경을 리듀서에 요청하는 메소드
  // 변경 후 변경 사항을 notify 한다.
  dispatch(action) {
    this.prevState = this.state;
    this.state = this.reducer.reduce(this.state, action);

    // 기존 상태들과 새로운 상태들을 비교해서 바뀐 상태 값을 확인
    const changedStates = Object.entries(this.state).filter(([key, value]) => {
      return Object.entries(this.prevState).some(([prevKey, prevValue]) => {
        return Object.is(prevKey, key) && !Object.is(prevValue, value);
      });
    });

    this.notifyChanges(changedStates);
  }

  // state 변경사항을 알리는 메소드
  notifyChanges(changedStates) {
    this.subscribers.forEach(({ subscriber, subscribingStates }) => {
      const isSubscribingStateChanged = changedStates.some(
        ([stateKey, stateValue]) => {
          return subscribingStates.includes(stateKey);
        }
      );

      if (isSubscribingStateChanged) subscriber.setState(this.state);
    });
  }

  // state getter 메소드
  getState() {
    return { ...this.state };
  }

  // subscriber getter 메소드
  getSubcriber() {
    return [...this.subscribers];
  }

  // data setter 메소드
  setState(state) {
    this.state = state;
  }

  // subscriber setter 메소드
  setSubscribers(subscribers) {
    this.subscribers = subscribers;
  }
}
