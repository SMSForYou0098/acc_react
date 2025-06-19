import React,{memo,lazy,Suspense} from 'react'
const Index = lazy(() => import('../views/dashboard/index'))

const HorizontalMultiRouter = memo(() => {
    return (
        <Suspense fallback={<div className="react-load"></div>}>
            <Index />
        </Suspense>
    )
}
)

HorizontalMultiRouter.displayName="HorizontalMultiRouter"
export default HorizontalMultiRouter
