import React, { Component, useEffect } from "react";
const StepStyles = require("../styles/Step.module.scss");
import { InView } from "react-intersection-observer";
import { useInView } from "react-intersection-observer";
import next from "next";

// const PublishedStep = React.memo((props: any) => {
//   const [ref, inView, entry] = useInView({
//     /* Optional options */
//     // root: props.root,
//     threshold: 1,
//     rootMargin: "0% 0% -50% 0%",
//   });
// //   console.log("rerender", props.index);
//   if (inView) {
//     // console.log("inview for", props.index, "is", inView);
//   }
//     useEffect(() => {
//       console.log("inview for", props.index, "is", inView);
//       props.updateInView(props.index);
//     }, [inView]);

//   useEffect;

//   return (
//     <div ref={ref} className={StepStyles.Step}>
//       <h1>{props.index}</h1>
//       {props.children}
//     </div>
//   );
// });

type PublishedStepProps = {
  index: number;
  changeStep: (inView: number) => void;
};

// class PublishedStep extends Component<PublishedStepProps> {
//   rootRef: React.RefObject<HTMLDivElement>;
//   observer: IntersectionObserver | undefined;

//   constructor(props: PublishedStepProps) {
//     super(props);

//     this.rootRef = React.createRef();
//     const options = {
//       //   root: this.rootRef.current,
//       rootMargin: "0% 0% 0% 0%",
//       threshold: 1,
//       //   root: this.rootRef.current,
//     };
//     this.observer = new IntersectionObserver(
//       this.changeStep.bind(this),
//       options
//     );
//   }

//   componentDidMount() {}

//   changeStep() {
//     console.log("changing step to", this.props.index);
//     this.props.changeStep(this.props.index);
//   }

//   render() {
//     let { index, children } = this.props;

//     return (
//       <div ref={this.rootRef} className={StepStyles.Step}>
//         <h1>{index}</h1>
//         {children}
//       </div>
//     );
//   }
// }

// class PublishedStep extends Component<PublishedStepProps> {
//   constructor(props: any) {
//     super(props);

//     this.state = {};
//   }

//   shouldComponentUpdate(nextProps: PublishedStepProps, nextState: any) {
//     console.log("scu");
//     if (this.props.index !== nextProps.index) {
//       console.log(
//         "index switching from",
//         nextProps.index,
//         " to",
//         this.props.index
//       );
//       return true;
//     }
//     console.log("not updating component");
//     return false;
//   }

//   render() {
//     let { index, children } = this.props;
//     return (
//       <InView
//         className={StepStyles.Step}
//         as="div"
//         rootMargin="0% 0% -50% 0%"
//         threshold={1}
//         triggerOnce={true}
//         onChange={(inView, entry) => {
//           if (inView) {
//             console.log("inview for", index, "is", inView);
//             this.props.changeStep(index);
//           }
//         }}
//       >
//         <h1>{this.props.index}</h1>
//         {children}
//       </InView>
//     );
//   }
// }

// function PublishedStep(props: any) {
//   const [ref, inView, entry] = useInView({
//     /* Optional options */
//     // root: props.root,
//     threshold: 1,
//     rootMargin: "0% 0% -50% 0%",
//   });
//   console.log("rerender", props.index);
//   if (inView) {
//     console.log("inview for", props.index, "is", inView);
//   }

// //   useEffect(() => {
// //     console.log("inview for", props.index, "is", inView);
// //       props.updateInView(props.index);
// //   }, [inView]);

//   useEffect;

//   return (
//     <div ref={ref} className={StepStyles.Step}>
//       <h1>{props.index}</h1>
//       {props.children}
//     </div>
//   );
// }

function PublishedStep(props: any) {
  const [ref, inView, entry] = useInView({
    /* Optional options */
    // root: props.root,
    threshold: 1,
    rootMargin: "10% 0% -50% 0%",
  });

  useEffect(() => {
    if (inView) {
      props.changeStep(props.index);
    }
  }, [inView]);

  return (
    <div ref={ref} className={StepStyles.Step}>
      <h1>{props.index}</h1>
      {props.children}
    </div>
  );
}

export default PublishedStep;
