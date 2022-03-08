import { createRef, useEffect, useRef, useState, useContext, Suspense } from 'react';
import * as tf from "@tensorflow/tfjs"; 

function DrawingCanvas ({createClear, createChangeCanvasBorder, createPreprocess}) {

    const canvasRef = useRef(null)
    const contextRef = useRef(null)
    const [isDrawing, setIsDrawing] = useState(false)

    useEffect(() => {

        const canvas = canvasRef.current;
        canvas.width = 400;
        canvas.height = 400;
        canvas.style.width = `400px`;
        canvas.style.height = `400px`;
        canvas.style.border = '3px solid gold';
        canvas.style.backgroundColor = '#fff';
        canvas.scale = 1;
    
        const context = canvas.getContext("2d")
        context.scale(1,1)
        context.lineCap = "round"
        context.strokeStyle = "black"
        context.lineWidth = 10
        contextRef.current = context;
      
        function clear(){
          contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          contextRef.current.beginPath();
        }
        createClear(()=>clear)

        const changeCanvasBorder = (style) => {
          const canvas = canvasRef.current;
          canvas.style.border = style;
        }
        createChangeCanvasBorder(()=>changeCanvasBorder)

        function preprocess() {
          const context = contextRef.current;
          var imageData = context.getImageData(0, 0, 400, 400);
          let tensor = tf.browser.fromPixels(imageData, 4);
          const resized = tf.image.resizeBilinear(tensor, [100, 100]).toFloat();
          const offset = tf.scalar(255.0);
          const normalized = resized.div(offset);
          var arrOld = normalized.dataSync();
          var arr = [];
          for (var i = 3; i < arrOld.length; i = i+4) {
            arr.push(1.0 - arrOld[i]);
          }
          var newTensor = tf.tensor(arr);
          var batched = tf.reshape(newTensor, [1, 100, 100, 1]);
          return batched;
        }
        createPreprocess(()=>preprocess)
      }, [createClear, createChangeCanvasBorder, createPreprocess])    

      const startDrawing = ({nativeEvent}) => {
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.beginPath()
        contextRef.current.moveTo(offsetX, offsetY)
        setIsDrawing(true)
      }

      const finishDrawing = () => {
        contextRef.current.closePath()
        setIsDrawing(false)
      }
    
      const draw = ({nativeEvent}) => {
        if(!isDrawing) {
          return
        }
        const {offsetX, offsetY} = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY)
        contextRef.current.stroke()
      }

    return (<canvas id='my-canvas'
                onMouseDown={startDrawing}
                onTouchStart={startDrawing}
                onMouseUp={finishDrawing}
                onTouchEnd={finishDrawing}
                onMouseMove={draw}
                onTouchMove={draw}
                //onDoubleClick={clear}
                ref={canvasRef}
            />
    )
  }

export default DrawingCanvas;