import React,{memo,lazy,Suspense} from 'react'
const Index = lazy(() => import('../views/dashboard/index'))
const HorizontalRouter = memo(() => {
    return (
        <Suspense fallback={<div className="react-load"></div>}>
            <Index />
        </Suspense>
    )
}
)

HorizontalRouter.displayName="HorizontalRouter"
export default HorizontalRouter
